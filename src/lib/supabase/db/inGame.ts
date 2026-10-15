import {objectToCamel, objectToSnake} from "@/lib/util/camelSnake";
import {supabase} from "@/lib/supabase/client/client";
import toast from "react-hot-toast";

const supabaseInGame = {
    get: {
        allMessages: async (gameId: string) => {
            const {data, error} = await supabase.from(`game_chat_messages`).select()
                .eq(`game_id`, gameId);
            return !error ? objectToCamel(data) : []
        },
        allMessagesAfterDate: async (gameId: string, date: string) => {
            const {data, error} = await supabase.from(`game_chat_messages`).select()
                .eq(`game_id`, gameId).gte('updated_at', date);
            return !error ? objectToCamel(data) : [];
        },
        settings: async (gameId: string) => {
            const {data, error} = await supabase.from(`game_settings`).select()
                .eq(`game_id`, gameId).single();
            return objectToCamel(data);
        }
    },
    live: {
        messages: (gameId: string, handler: (payload: any) => void) => {
            return supabase
                .channel(`messages-${gameId}`)
                .on(
                    `postgres_changes`,
                    {
                        event: `*`,
                        schema: `public`,
                        table: `game_chat_messages`,
                        filter: `game_id=eq.${gameId}`
                    },
                    (payload) => {
                        handler(objectToCamel([payload.new]));
                    }
                )
                .subscribe();
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
                        handler(objectToCamel(payload.new));
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
            })]).select();

            if (error) {
                toast.error(`Could not send message.`);
                return null;
            }
            return objectToCamel(data);
        },
        talkingStick: async (gameId: string, playerId: string) => {
            const {data, error} = await supabase.from(`game_settings`)
                .update(objectToSnake({talkingStick: playerId})).eq(`game_id`, gameId).select().single();
            if (error) toast.error(`Could not update talking stick.`)
        }
    },
    edit: {
        message: {
            channel: async (messageId: string, channel: string[]) => {
                const {data, error} = await supabase.from(`game_chat_messages`)
                    .update({channel})
                    .eq(`id`, messageId).select().single();
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
                    .eq(`id`, messageId).select().single();
                if (error) {
                    toast.error(`Could not edit message.`);
                    return null;
                }
                return objectToCamel(data);
            },
            locked: async (messageId: string, locked: boolean) => {
                const {data, error} = await supabase.from(`game_chat_messages`)
                    .update({locked})
                    .eq(`id`, messageId).select().single();
                if (error) {
                    toast.error(`Could not ${locked ? `lock` : `unlock`} message.`);
                    return null;
                }
                return objectToCamel(data);
            },
            pinned: async (messageId: string, isPinned: boolean) => {
                const {data, error} = await supabase.from(`game_chat_messages`)
                    .update(objectToSnake({isPinned}))
                    .eq(`id`, messageId).select().single();
                if (error) {
                    toast.error(`Could not ${isPinned ? `pin` : `unpin`} message.`);
                    return null;
                }
                return objectToCamel(data);
            },
            delete: async (messageId: string) => {
                // Soft delete: the row stays, the UI filters out `deleted` messages
                const {data, error} = await supabase.from(`game_chat_messages`)
                    .update({deleted: true})
                    .eq(`id`, messageId).select().single();
                if (error) {
                    toast.error(`Could not delete message.`);
                    return null;
                }
                return objectToCamel(data);
            }
        }
    }
}
export {supabaseInGame}