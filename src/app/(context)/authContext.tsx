'use client'
import {Session, User} from "@supabase/supabase-js";
import {createContext, Dispatch, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {supabase} from "@/lib/supabase/client/client"
import {redirect} from "next/navigation";
import {supabaseGame} from "@/lib/supabase/db/game";
import {CamelCase, objectToCamel} from "@/lib/util/camelSnake";
import {supabaseAccount} from "@/lib/supabase/db/account";
import toast from "react-hot-toast";

type CamelUser = CamelCase<User>
type CamelSession = CamelCase<Session>
type AuthContextType = {
    user: CamelUser | null;
    session: CamelSession | null;
    userLoading: boolean;
    gamesLoading: boolean;
    signOut: () => Promise<void>,
    gmGames: Array<any>,
    playerGames: Array<any>,
    updateGames: () => Promise<void>,
    newNotification: any,
    setNewNotification: Dispatch<any>
};

const AuthManagerContext = createContext<AuthContextType | null>(null);

export function AuthManagerProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<CamelUser | null>(null);
    const [session, setSession] = useState<CamelSession | null>(null);
    const [userLoading, setUserLoading] = useState(true);
    const [gamesLoading, setGamesLoading] = useState(true);
    const [gmGames, setGmGames] = useState<Array<any>>([]);
    const [playerGames, setPlayerGames] = useState<Array<any>>([]);
    const [newNotification, setNewNotification] = useState<any>(null);
    const [notifications, setNotifications] = useState<Array<any>>([]);

    const gmGamesRef = useRef(gmGames);
    const playerGamesRef = useRef(playerGames);

    useEffect(() => { gmGamesRef.current = gmGames; }, [gmGames]);
    useEffect(() => { playerGamesRef.current = playerGames; }, [playerGames]);


    useEffect(() => {
        // get initial session
        supabase.auth.getSession().then(({data}) => {
            const newData = objectToCamel(data.session)
            setSession(newData);
            setUser(newData?.user ?? null);
            setUserLoading(false);
        });
        // listen for changes
        const {data: listener} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const newData = objectToCamel(session)
                setSession(newData);
                setUser(newData?.user ?? null);
                setUserLoading(false);
            }
        );
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!userLoading && !user) {
            redirect('/auth/login')
        } else if (user) {
            updateGames()
            let notificationsChannel = supabaseAccount.live.notifications(user.id, updateNotifications);
            return () => {
                supabase.removeChannel(notificationsChannel);
            }
        }
    }, [user]);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    async function updateGames() {
        if (!user) return;
        const newGmGame = await supabaseGame.get.game.gm(user.id)
        const newPlayerGame = await supabaseGame.get.game.player(user.id)
        setGmGames(newGmGame);
        setPlayerGames(newPlayerGame);
        setGamesLoading(false)
    }

    async function updateNotification() {
        if (!user) return
        const tempNotification = await supabaseAccount.get.notifications(user.id)
        setNotifications(tempNotification)
    }

    async function updateNotifications(input: any) {
        let payload: any = input[0];
        setNotifications([...notifications, payload])
        setNewNotification(payload)
        const id = payload.data.gameId;
        const gmGame = gmGamesRef.current.find((g) => g.id === id);
        const game = gmGame ?? playerGamesRef.current.find((g) => g.id === id);

        switch (payload.type) {
            case `game_created`:
                toast(`Game Created successfully.`);
                updateGames()
                break;
            case  `join_request_created`:
                toast(`Someone requested to join a game.`);
                updateGames()
                break;
            case `game_joined_as_player`:
                toast(`You have joined a game.`);
                updateGames()
                break;
            case `player_joined`:
                toast(`You accepted a player to your game.`);
                updateGames()
                break;
            case `game_edited`:
                if (game) {
                    toast(gmGame ? `You updated: ${game.name}.` : `${game.name} has been updated.`);
                }
                updateGames()
                break;
            case `game_started`:

                if (game) {
                    toast(gmGame ? `You started: ${game.name}.` : `${game.name} has started.`);
                }
                updateGames()
                break;
            case `game_stopped`:
                if (game) {
                    toast(gmGame ? `You stopped: ${game.name}.` : `${game.name} has stopped.`);
                }
                updateGames()
                break;
        }
    }

    const value: AuthContextType = {
        user,
        session,
        userLoading,
        signOut,
        gmGames,
        playerGames,
        gamesLoading,
        updateGames,
        newNotification,
        setNewNotification
    };
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