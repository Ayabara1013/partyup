import {supabase} from "@/lib/supabase/client/client";
import {objectToCamel} from "@/lib/util/camelSnake";

const supabaseAccount = {
    live: {
        notifications: (userId: string, handler: (payload: any) => void) => {
            return supabase
                .channel(`notifications:${userId}`)
                .on(
                    "postgres_changes",
                    {
                        event: "INSERT",
                        schema: "public",
                        table: "notifications",
                        filter: `user_id=eq.${userId}`,
                    },
                    (payload) => {
                        handler(objectToCamel([payload.new]));
                    }
                )
                .subscribe();
        },
    },
}
export {supabaseAccount}