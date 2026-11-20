import {objectToCamel, objectToSnake} from "@/lib/util/camelSnake";
import {supabase} from "@/lib/supabase/client/client";
import toast from "react-hot-toast";
import type {CachedMessage} from "@/lib/util/localStorage";

// The message columns the chat reads (useGameMessages trims realtime rows to the same fields)
const MESSAGE_COLUMNS = `id, created_at, updated_at, edited_at, player_id, channel, message_text, log, system,
    deleted, is_pinned, reply_to, locked`;

// Pages are read until one comes back empty, so a lower "Max rows" setting (1000 on 2026-11-12) still works
const MESSAGE_PAGE_SIZE = 1000;

type MessageHandlers = {
    change: (rows: CachedMessage[]) => void; // inserted or updated rows
    delete: (id: string) => void;            // a hard-deleted row (may belong to another game: deletes can't be filtered)
    subscribed: () => void;                  // after every join and re-join, so the caller can fetch what it missed
};

const supabaseInGame = {
    get: {
        // Every message of the game changed at or after `since` (all of them when null), oldest change first.
        // Pages by (updated_at, id): rows written by one statement share an updated_at, and the id keeps paging moving.
        // Timestamps go back exactly as the server sent them (microseconds). Returns null if any page fails.
        messagesSince: async (gameId: string, since: string | null): Promise<CachedMessage[] | null> => {
            const rows: unknown[] = [];
            let last: { updated_at: string; id: string } | null = null;
            for (; ;) {
                let query = supabase.from(`game_chat_messages`).select(MESSAGE_COLUMNS).eq(`game_id`, gameId);
                if (last) {
                    query = query.or(`updated_at.gt."${last.updated_at}",and(updated_at.eq."${last.updated_at}",id.gt.${last.id})`);
                } else if (since) {
                    query = query.gte(`updated_at`, since);
                }
                const {data, error} = await query.order(`updated_at`).order(`id`).limit(MESSAGE_PAGE_SIZE);
                if (error) return null;
                if (!data?.length) return objectToCamel(rows) as CachedMessage[];
                rows.push(...data);
                last = data[data.length - 1];
            }
        },
        // null when the row can't be read (the page offers a retry)
        settings: async (gameId: string) => {
            const {data, error} = await supabase.from(`game_settings`).select()
                .eq(`game_id`, gameId).single();
            return error || !data ? null : objectToCamel(data);
        }
    },
    live: {
        messages: (gameId: string, on: MessageHandlers) => {
            return supabase
                .channel(`messages-${gameId}-${crypto.randomUUID()}`)
                .on(
                    `postgres_changes`,
                    {
                        event: `*`,
                        schema: `public`,
                        table: `game_chat_messages`,
                        filter: `game_id=eq.${gameId}`
                    },
                    (payload) => {
                        // A DELETE carries only the old row's id
                        if (payload.eventType === `DELETE`) {
                            if (payload.old?.id) on.delete(payload.old.id);
                        } else {
                            on.change(objectToCamel([payload.new]) as CachedMessage[]);
                        }
                    }
                )
                .subscribe((status) => {
                    if (status === `SUBSCRIBED`) on.subscribed();
                });
        },
        settings: (gameId: string, handler: (payload: any) => void) => {
            return supabase
                .channel(`settings-${gameId}-${crypto.randomUUID()}`)
                .on(
                    `postgres_changes`,
                    {
                        event: `*`,
                        schema: `public`,
                        table: `game_settings`,
                        filter: `game_id=eq.${gameId}`
                    },
                    (payload) => {
                        if (payload.eventType !== `DELETE`) handler(objectToCamel(payload.new)); // no row on a delete
                    }
                )
                .subscribe();
        }
    },
    set: {
        addMessage: async (gameId: string, messageText: string, userId: string, channel: string, promptInfo: any = null, replyTo: string | null = null) => {
            // GM canon posts also go to turn so players can respond to them
            const channels = channel === `canon` ? [`canon`, `turn`] : [channel];
            const {data, error} = await supabase.from(`game_chat_messages`).insert([objectToSnake({
                gameId,
                messageText,
                playerId: userId,
                channel: channels,
                promptInfo: promptInfo,
                ...(replyTo && {replyTo}),
                tags: []
            })]).select(`id`);

            if (error) {
                toast.error(`Could not send message.`);
                return null;
            }
            return objectToCamel(data);
        },
        talkingStick: async (gameId: string, playerId: string) => {
            const {data, error} = await supabase.from(`game_settings`)
                .update(objectToSnake({talkingStick: playerId})).eq(`game_id`, gameId).select(`game_id`).single();
            if (error) toast.error(`Could not update talking stick.`)
        }
    },
    edit: {
        message: {
            channel: async (messageId: string, channel: string[]) => {
                const {data, error} = await supabase.from(`game_chat_messages`)
                    .update({channel})
                    .eq(`id`, messageId).select(`id`).single();
                if (error) {
                    toast.error(`Could not update message.`);
                    return null;
                }
                return objectToCamel(data);
            },
            text: async (messageId: string, messageText: string) => {
                // Fails if the message is locked (chat_message_lock trigger)
                const {data, error} = await supabase.from(`game_chat_messages`)
                    .update(objectToSnake({messageText}))
                    .eq(`id`, messageId).select(`id`).single();
                if (error) {
                    toast.error(`Could not edit message.`);
                    return null;
                }
                return objectToCamel(data);
            },
            locked: async (messageId: string, locked: boolean) => {
                const {data, error} = await supabase.from(`game_chat_messages`)
                    .update({locked})
                    .eq(`id`, messageId).select(`id`).single();
                if (error) {
                    toast.error(`Could not ${locked ? `lock` : `unlock`} message.`);
                    return null;
                }
                return objectToCamel(data);
            },
            pinned: async (messageId: string, isPinned: boolean) => {
                const {data, error} = await supabase.from(`game_chat_messages`)
                    .update(objectToSnake({isPinned}))
                    .eq(`id`, messageId).select(`id`).single();
                if (error) {
                    toast.error(`Could not ${isPinned ? `pin` : `unpin`} message.`);
                    return null;
                }
                return objectToCamel(data);
            },
            // Soft delete (true) or restore (false): the row stays; the UI hides `deleted` messages unless the GM shows them
            delete: async (messageId: string, deleted: boolean) => {
                const {data, error} = await supabase.from(`game_chat_messages`)
                    .update({deleted})
                    .eq(`id`, messageId).select(`id`).single();
                if (error) {
                    toast.error(`Could not ${deleted ? `delete` : `restore`} message.`);
                    return null;
                }
                return objectToCamel(data);
            }
        },
        // The GM's changes to a dice result: database functions that check the GM and the limits
        roll: {
            adjust: async (messageId: string, value: number, label: string | null, group: number) => {
                const {error} = await supabase.rpc(`adjust_roll`, {
                    p_message_id: messageId, p_value: value, p_label: label, p_group: group,
                });
                if (error) toast.error(error.message);
                return !error;
            },
            reset: async (messageId: string) => {
                const {error} = await supabase.rpc(`reset_roll`, {p_message_id: messageId});
                if (error) toast.error(error.message);
                return !error;
            },
        },
    }
}
export {supabaseInGame}