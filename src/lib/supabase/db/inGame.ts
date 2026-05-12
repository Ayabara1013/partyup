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
        addMessage: async (gameId: string, messageText: string, userId: string, channel: string) => {
            return supabase.from(`game_chat_messages`).insert([objectToSnake({
                gameId, messageText, playerId: userId, channel
            })]).select();

        },
        talkingStick: async (gameId: string, playerId: string) => {
            const {data, error} = await supabase.from(`game_settings`)
                .update(objectToSnake({talkingStick: playerId})).eq(`game_id`, gameId).select().single();
            if (error) toast.error(`Could not update talking stick.`)
        }
    }
}
export {supabaseInGame}