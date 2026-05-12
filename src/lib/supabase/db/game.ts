import {objectToCamel, objectToSnake} from "@/lib/util/camelSnake";
import {supabase} from "@/lib/supabase/client/client";
import toast from "react-hot-toast";

const supabaseGame = {
    get: {
        game: {
            gm: async (userId: string) => {
                const {data, error} = await supabase
                    .from(`game`).select(`
                *,
                players:game_player(user:user_id (*)),
                joinRequests:join_requests(user:user_id (*))`).eq(`gm_uid`, userId);
                let camelData = objectToCamel(data)
                const games = await Promise.all((camelData ?? []).map(async (game: any) => {
                    const {data: gm, error: error2} = await supabase.from(`user`)
                        .select(`*`).eq(`id`, game.gmUid).single();
                    return ({
                        ...game,
                        players: (game.players ?? []).map((p: any) => p.user),
                        joinRequests: (game.joinRequests ?? []).map((p: any) => p.user),
                        gm: objectToCamel(gm),
                    })
                }))
                return objectToCamel(games ?? []);
            },
            player: async (userId: string) => {
                const {data, error} = await supabase.from(`game_player`)
                    .select(`game:game_id (*, players:game_player(user:user_id (*)))`).eq(`user_id`, userId);
                const games = await Promise.all(
                    (objectToCamel(data ?? [])).map(async (p: any) => {
                        const {data: gm, error: error2} = await supabase.from(`user`)
                            .select(`*`).eq(`id`, p.game.gmUid).single();
                        return {
                            ...p.game,
                            players: (p.game.players ?? []).map((p: any) => p.user),
                            gm: objectToCamel(gm),
                        };
                    })
                );
                return objectToCamel(games ?? []);
            },
            fromInvite: async (inviteCode: string) => {
                const {data: gameData, error} = await supabase.rpc(`get_game_by_invite_code`, {
                    code: inviteCode,
                }).single();
                if (gameData) {
                    let newData: any = objectToCamel(gameData);
                    const {data: gmData, error: gmError} = await supabase
                        .from(`user`).select(`*`).eq(`id`, newData.gmUid).single();
                    newData.gm = objectToCamel(gmData);
                    const {data: players, error: pError} = await supabase
                        .from(`game_player`).select(`user:user_id (*)`).eq(`game_id`, newData.id);
                    newData.players = (players ?? []).map((p: any) => p.user)
                    return newData;
                }
                return null;
            }
        },
        joinRequest: {
            exists: async (gameId: string, userId: string) => {
                const {data, error} = await supabase
                    .from(`join_requests`).select(`*`)
                    .eq(`game_id`, gameId).eq(`user_id`, userId);
                return !error && data?.length > 0;

            }
        }
    },
    set: {
        create: {
            game: async (userId: string, data: any) => {
                return supabase.from('game').insert([
                    {
                        gm_uid: userId,
                        name: data.name,
                        description: data.description,
                        system: data.system,
                        max_players: data.maxPlayers,
                        age_restriction: data.ageRes,
                        is_public: data.isPublic,
                        sc0: data.sc0,
                        sc1: data.sc1,
                        sc2: data.sc2,
                        sc3: data.sc3,
                        tags: data.tags,
                        started: false
                    }
                ]).select();
            }
        },
        edit: {
            game: async () => {

            },
            startGame: async (gameId: string) => {
                const {data: uData, error: uError} = await supabase.from(`game`)
                    .update({started: true}).eq(`id`, gameId).select().single();
                if (uError) {
                    console.error(uError);
                    toast.error(`Could not update game entry`)
                    return false
                }
                toast.success(`Started Game`)
                return true
            }
        },
        join: async (gameId: string, userId: string) => {
            const {error} = await supabase
                .from('join_requests').insert([objectToSnake({gameId, userId})]).select().single();
            return !error;
        },
        acceptRequest: async (gameId: string, userId: string) => {
            const {error} = await supabase.from('join_requests').delete()
                .eq(`game_id`, gameId).eq(`user_id`, userId);
            console.log(error)
            if (error) {
                toast.error(`Could not delete request`)
                return false
            }
            const {data, error: error2} = await supabase.from('game_player')
                .insert([objectToSnake({gameId, userId})]).select().single();
            if (error2) {
                toast.error(`Could not create player database entry.`)
            }
            return !error2 && data
        }
    }
}
export {supabaseGame};