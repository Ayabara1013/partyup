import {objectToCamel, objectToSnake} from "@/lib/util/camelSnake";
import {supabase} from "@/lib/supabase/client/client";
import toast from "react-hot-toast";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const supabaseGame = {
    get: {
        game: {
            // One query each: the GM is embedded instead of fetched per game
            gm: async (userId: string) => {
                const {data, error} = await supabase.from(`game`).select(`
                    *,
                    gm:user!game_gm_id_fkey (*),
                    players:game_player (user:user_id (*)),
                    joinRequests:join_requests (user:user_id (*))`)
                    .eq(`gm_uid`, userId);
                if (error) return [];
                return objectToCamel(data ?? []).map((game: any) => ({
                    ...game,
                    players: (game.players ?? []).map((p: any) => p.user),
                    joinRequests: (game.joinRequests ?? []).map((p: any) => p.user),
                }));
            },
            player: async (userId: string) => {
                const {data, error} = await supabase.from(`game_player`).select(`
                    game:game_id (
                        *,
                        gm:user!game_gm_id_fkey (*),
                        players:game_player (user:user_id (*)))`)
                    .eq(`user_id`, userId);
                if (error) return [];
                return objectToCamel(data ?? []).map(({game}: any) => ({
                    ...game,
                    players: (game.players ?? []).map((p: any) => p.user),
                }));
            },
            // Open public games for Discover, newest first. With userId, each game also says whether
            // that user already asked to join (one query, the request is embedded).
            publicGameList: async ({systems, safetyChecks = [], hideAgeRestricted = false, sortBy = `time`, search = ``, userId}: {
                systems: string[];
                safetyChecks?: string[];
                hideAgeRestricted?: boolean;
                sortBy?: `time` | `name`;
                search?: string;
                userId?: string;
            }) => {
                let query = supabase.from(`game`)
                    .select(`*,
                    gm:user!game_gm_id_fkey (id,name,image_url),
                    players:game_player!game_player_game_id_fkey (
                        user:user!game_player_user_id_fkey (id,name,image_url)),
                    myRequests:join_requests (user_id)`)
                    .eq(`is_public`, true).eq(`started`, false)
                    .in(`system`, systems);

                if (userId) query = query.eq(`myRequests.user_id`, userId);
                for (const sc of safetyChecks) query = query.eq(sc, true);

                // Terms are separated by ";". Characters that would break the filter syntax are dropped.
                for (const term of search.split(`;`).map((t) => t.replace(/[,()"\\{}%*]/g, ``).trim()).filter(Boolean)) {
                    query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%,tags.cs.{${term}}`);
                }

                // age_restriction is the minimum age; 10 is the unrestricted default
                if (hideAgeRestricted) query = query.lte(`age_restriction`, 10);

                query = sortBy === `name`
                    ? query.order(`name`, {ascending: true})
                    : query.order(`created_at`, {ascending: false});

                const {data, error} = await query;
                if (error) {
                    console.error(`Error fetching public games:`, error);
                    return null;
                }

                return objectToCamel(data ?? []).map(({myRequests, ...game}: any) => ({
                    ...game,
                    players: (game.players ?? []).map((p: any) => p.user),
                    requested: (myRequests ?? []).length > 0,
                }));
            },
            // Game for an invite link, in one call: GM, players and (with userId) whether that user
            // already asked to join are embedded on the RPC result. Returns null if the code matches nothing.
            fromInvite: async (inviteCode: string, userId?: string) => {
                if (!UUID_RE.test(inviteCode)) return null;

                let query = supabase.rpc(`get_game_by_invite_code`, {code: inviteCode}).select(`*,
                    gm:user!game_gm_id_fkey (*),
                    players:game_player (user:user_id (*)),
                    myRequests:join_requests (user_id)`);
                if (userId) query = query.eq(`myRequests.user_id`, userId);

                const {data, error} = await query.maybeSingle();
                if (error || !data) return null;

                const {myRequests, ...game}: any = objectToCamel(data);
                return {
                    ...game,
                    players: (game.players ?? []).map((p: any) => p.user),
                    requested: (myRequests ?? []).length > 0,
                };
            }
        },
    },
    set: {
        create: {
            // Returns the new game row, or null (with a toast) if it couldn't be created
            game: async (userId: string, data: any) => {
                const {data: game, error} = await supabase.from(`game`).insert([
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
                ]).select().single();
                if (error) {
                    console.error(error);
                    toast.error(`Could not create the game.`);
                    return null;
                }
                return objectToCamel(game);
            }
        },
        edit: {
            // Returns the updated game row, or null (with a toast) if it couldn't be saved
            game: async (data: any, gameId: string) => {
                const {data: result, error} = await supabase.from(`game`).update(
                    {
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
                        tags: data.tags
                    }
                ).eq(`id`, gameId).select().single();
                if (error) {
                    console.error(error);
                    toast.error(`Could not save the game.`);
                    return null;
                }
                return objectToCamel(result);
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
                .from(`join_requests`).insert([objectToSnake({gameId, userId})]).select().single();
            return !error;
        },
        // Add the player first, then remove the request, so a failed insert doesn't lose the request
        acceptRequest: async (gameId: string, userId: string) => {
            const {data, error} = await supabase.from(`game_player`)
                .insert([objectToSnake({gameId, userId})]).select().single();
            if (error) {
                toast.error(`Could not add the player to the game.`)
                return false
            }
            const {error: deleteError} = await supabase.from(`join_requests`).delete()
                .eq(`game_id`, gameId).eq(`user_id`, userId);
            if (deleteError) toast.error(`Player added, but the join request could not be removed.`)
            return data
        }
    }
}
export {supabaseGame};