'use client'
import {User} from "@supabase/supabase-js";
import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {supabase} from "@/lib/supabase/client/client"
import {useRouter} from "next/navigation";
import {loginHref} from "@/lib/routing/nextPath";
import {pendingInvite} from "@/lib/routing/pendingInvite";
import {supabaseGame} from "@/lib/supabase/db/game";
import {CamelCase, objectToCamel} from "@/lib/util/camelSnake";
import {supabaseAccount} from "@/lib/supabase/db/account";
import toast from "react-hot-toast";

type CamelUser = CamelCase<User>
type AuthContextType = {
    user: CamelUser | null;
    userLoading: boolean;
    gamesLoading: boolean;
    signOut: () => Promise<void>,
    gmGames: Array<any>,
    playerGames: Array<any>,
    updateGames: () => Promise<void>,
};

const AuthManagerContext = createContext<AuthContextType | null>(null);

// Toast for each notification type: one text for everyone, or one for the GM and one for players that names the game
type gameToast = (name: string) => string;
const notificationToast: Record<string, { text?: string, gm?: gameToast, player?: gameToast }> = {
    game_created: {text: `Game Created successfully.`},
    join_request_created: {text: `Someone requested to join a game.`},
    game_joined_as_player: {text: `You have joined a game.`},
    player_joined: {text: `You accepted a player to your game.`},
    game_edited: {gm: (name) => `You updated: ${name}.`, player: (name) => `${name} has been updated.`},
    game_started: {gm: (name) => `You started: ${name}.`, player: (name) => `${name} has started.`},
    game_stopped: {gm: (name) => `You stopped: ${name}.`, player: (name) => `${name} has stopped.`},
};

// Whether the game lists already show what a notification reports, so it needs no refresh. `game_edited` can't be
// told from the lists (any field may have changed), so it always refreshes.
type ListGame = { started?: boolean, players?: { id: string }[], joinRequests?: { id: string }[] };
function listsShow(type: string, data: { userId?: string, requestUserId?: string },
                   gmGame: ListGame | undefined, playerGame: ListGame | undefined): boolean {
    switch (type) {
        case `game_created`:
            return !!gmGame;
        case `game_started`:
        case `game_stopped`: {
            const game = gmGame ?? playerGame;
            return !!game && game.started === (type === `game_started`);
        }
        case `game_joined_as_player`:
            return !!playerGame;
        case `player_joined`:
            return !!gmGame?.players?.some((p) => p?.id === data.userId);
        case `join_request_created`:
            return !!gmGame?.joinRequests?.some((u) => u?.id === data.requestUserId);
        default:
            return false;
    }
}

export function AuthManagerProvider({children}: { children: ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<CamelUser | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [gamesLoading, setGamesLoading] = useState(true);
    const [gmGames, setGmGames] = useState<Array<any>>([]);
    const [playerGames, setPlayerGames] = useState<Array<any>>([]);
    const userId = user?.id ?? null;
    const gamesRequest = useRef(0);

    // The lists as last loaded, for the notification handler: set together with the state, because the handler can
    // run before React renders again
    const gmGamesRef = useRef(gmGames);
    const playerGamesRef = useRef(playerGames);
    // The refresh that is running, if any; `again` asks it to go round once more when it finishes
    const refresh = useRef<{ promise: Promise<void>, again: boolean } | null>(null);

    // The listener also reports the initial session, so no separate getSession() call is needed
    useEffect(() => {
        const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
            const next = objectToCamel(session)?.user ?? null;
            // Token refreshes and tab refocus re-send the same user: keep the old object so nothing re-renders
            setUser((prev) => prev && next && prev.id === next.id && prev.updatedAt === next.updatedAt ? prev : next);
            setUserLoading(false);
            if (!next) {
                gamesRequest.current++;
                refresh.current = null; // a running refresh doesn't go round again
                gmGamesRef.current = [];
                playerGamesRef.current = [];
                setGmGames([]);
                setPlayerGames([]);
                setGamesLoading(true);
            }
        });
        return () => listener.subscription.unsubscribe();
    }, []);

    // One refresh: both lists in parallel; an answer older than the newest request is dropped
    const fetchGames = useCallback(async () => {
        if (!userId) return;
        const request = ++gamesRequest.current;
        const [newGmGame, newPlayerGame] = await Promise.all([
            supabaseGame.get.game.gm(userId),
            supabaseGame.get.game.player(userId),
        ]);
        if (request !== gamesRequest.current) return;
        gmGamesRef.current = newGmGame;
        playerGamesRef.current = newPlayerGame;
        setGmGames(newGmGame);
        setPlayerGames(newPlayerGame);
        setGamesLoading(false);
    }, [userId]);

    // One refresh at a time. A call during a refresh doesn't start another: it asks the running one to go round once
    // more and waits for that, so `await updateGames()` still means "the lists are at least as fresh as my call"
    const updateGames = useCallback((): Promise<void> => {
        if (refresh.current) {
            refresh.current.again = true;
            return refresh.current.promise;
        }
        const state = {promise: Promise.resolve(), again: false};
        state.promise = (async () => {
            try {
                do {
                    state.again = false;
                    await fetchGames();
                } while (state.again && refresh.current === state);
            } finally {
                if (refresh.current === state) refresh.current = null;
            }
        })();
        refresh.current = state;
        return state.promise;
    }, [fetchGames]);

    useEffect(() => {
        if (userLoading) return;

        if (!userId) {
            // Already on a sign-in page (/auth/login, /auth/error): the proxy put the right ?next= there
            if (window.location.pathname.startsWith(`/auth`)) return;
            // Signed out: send them to the login page
            pendingInvite.save(window.location.pathname);
            router.replace(loginHref(window.location.pathname + window.location.search));
            return;
        }

        // Signed in after opening an invite link while signed out: go back to that invite.
        // Anywhere other than the default landing page means the visitor already chose where to go.
        const invite = pendingInvite.take();
        const path = window.location.pathname;
        if (invite && (path === `/home` || path === `/`)) router.replace(invite);

        // Loading the user's games from the server; state is only set after the request resolves
        updateGames();
        const notificationsChannel = supabaseAccount.live.notifications(userId, async (input: any) => {
            const payload = input[0];
            const message = notificationToast[payload.type];
            if (!message) return;

            // A notification is a hint that something changed. Let a refresh that's already running finish, then look
            // at the lists: if they already show the change, this notification needs no refresh of its own.
            await refresh.current?.promise;
            const gmGame = gmGamesRef.current.find((g) => g.id === payload.data.gameId);
            const playerGame = playerGamesRef.current.find((g) => g.id === payload.data.gameId);
            const game = gmGame ?? playerGame;
            const text = message.text ?? (game && (gmGame ? message.gm : message.player)?.(game.name));
            if (text) toast(text);
            if (!listsShow(payload.type, payload.data, gmGame, playerGame)) updateGames();
        });
        return () => {
            supabase.removeChannel(notificationsChannel);
        };
    }, [userId, userLoading, updateGames, router]);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
    }, []);

    const value = useMemo<AuthContextType>(() => ({
        user, userLoading, signOut, gmGames, playerGames, gamesLoading, updateGames,
    }), [user, userLoading, signOut, gmGames, playerGames, gamesLoading, updateGames]);

    return (
        <AuthManagerContext.Provider value={value}>
            {children}
        </AuthManagerContext.Provider>
    )
}

export function useAuthManager() {
    const context = useContext(AuthManagerContext);
    if (!context) {
        throw new Error('useAuthManager must be used within an AuthManagerProvider');
    }
    return context;
}