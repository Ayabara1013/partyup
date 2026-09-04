'use client'
import {Session, User} from "@supabase/supabase-js";
import {createContext, Dispatch, ReactNode, useContext, useEffect, useState} from "react";
import {supabase} from "@/lib/supabase/client/client"
import {redirect} from "next/navigation";
import {supabaseGame} from "@/lib/supabase/db/game";
import {CamelCase, objectToCamel} from "@/lib/util/camelSnake";
import {supabaseAccount} from "@/lib/supabase/db/account";
import toast from "react-hot-toast";
import {supabaseInGame} from "@/lib/supabase/db/inGame";

type CamelUser = CamelCase<User>
type CamelSession = CamelCase<Session>
type AuthContextType = {
    user: CamelUser | null;
    session: CamelSession | null;
    loading: boolean;
    signOut: () => Promise<void>,
    gmGames: Array<any> | null,
    playerGames: Array<any> | null,
    updateGames: () => Promise<void>,
    newNotification: any,
    setNewNotification: Dispatch<any>
};

const AuthManagerContext = createContext<AuthContextType | null>(null);

export function AuthManagerProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<CamelUser | null>(null);
    const [session, setSession] = useState<CamelSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [gmGames, setGmGames] = useState<Array<any> | null>(null);
    const [playerGames, setPlayerGames] = useState<Array<any> | null>(null);
    const [newNotification, setNewNotification] = useState<any>(null);
    const [notifications, setNotifications] = useState<Array<any>>([]);

    useEffect(() => {
        // get initial session
        supabase.auth.getSession().then(({data}) => {
            const newData = objectToCamel(data.session)
            setSession(newData);
            setUser(newData?.user ?? null);
            setLoading(false);
        });
        // listen for changes
        const {data: listener} = supabase.auth.onAuthStateChange(
            (_event, session) => {
                const newData = objectToCamel(session)
                setSession(newData);
                setUser(newData?.user ?? null);
                setLoading(false);
            }
        );
        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!loading && !user) {
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
        console.log(payload)
        switch (payload.type) {
            case `game_created`:
                toast.success(`Game Created successfully.`);
                updateGames()
                break;
            case  `join_request_created`:
                toast.success(`Someone requested to join a game.`);
                updateGames()
                break;
            case `game_joined_as_player`:
                toast.success(`You have joined a game.`);
                updateGames()
                break;
            case `player_joined`:
                toast.success(`You accepted a player to your game.`);
                updateGames()
                break;
        }
    }

    const value: AuthContextType = {
        user,
        session,
        loading,
        signOut,
        gmGames,
        playerGames,
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