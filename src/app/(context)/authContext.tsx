'use client'
import {Session, User} from "@supabase/supabase-js";
import {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {supabase} from "@/lib/supabase/client/client"
import {redirect} from "next/navigation";
import {supabaseGame} from "@/lib/supabase/db/game";
import {CamelCase, objectToCamel} from "@/lib/util/camelSnake";

type CamelUser = CamelCase<User>
type CamelSession = CamelCase<Session>
type AuthContextType = {
    user: CamelUser | null;
    session: CamelSession | null;
    loading: boolean;
    signOut: () => Promise<void>,
    gmGames: Array<any> | null,
    playerGames: Array<any> | null,
    updateGames: () => Promise<void>
};

const AuthManagerContext = createContext<AuthContextType | null>(null);

export function AuthManagerProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<CamelUser | null>(null);
    const [session, setSession] = useState<CamelSession | null>(null);
    const [loading, setLoading] = useState(true);
    const [gmGames, setGmGames] = useState<Array<any> | null>(null);
    const [playerGames, setPlayerGames] = useState<Array<any> | null>(null);

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
        } else {
            updateGames()
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

    const value: AuthContextType = {
        user,
        session,
        loading,
        signOut,
        gmGames,
        playerGames,
        updateGames
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