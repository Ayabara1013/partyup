"use client"

import toast from "react-hot-toast";
import {use, useEffect} from 'react'
import {useRouter} from "next/navigation";
import {dirHref} from "@/lib/routing/directoy";
import {useAuthManager} from "@/app/(context)/authContext";
import {supabaseGame} from "@/lib/supabase/db/game";
import GameForm, {GameFormValues} from "@/app/games/(components)/GameForm";

type PageProps = {
    params: Promise<{ gameId: string }>;
};

export default function EditGamePage({params}: PageProps) {
    const {gameId} = use(params);
    const {push} = useRouter();
    const {userLoading, gmGames, gamesLoading, updateGames} = useAuthManager();

    const loading = userLoading || gamesLoading;
    // Only the GM's own games are in gmGames, so this doubles as the ownership check
    const game = gmGames.find((g) => g.id === gameId);

    useEffect(() => {
        if (!loading && !game) {
            toast.error(`You are not the owner of this game.`);
            push(dirHref.games.root);
        }
    }, [loading, game, push]);

    if (loading || !game) {
        return <div className="flex justify-center py-12"><span className="loading loading-dots loading-md"/></div>;
    }

    const initial: GameFormValues = {
        name: game.name ?? ``,
        description: game.description ?? ``,
        system: game.system,
        maxPlayers: game.maxPlayers,
        ageRes: game.ageRestriction,
        sc0: !!game.sc0,
        sc1: !!game.sc1,
        sc2: !!game.sc2,
        sc3: !!game.sc3,
        tags: game.tags ?? [],
        isPublic: game.isPublic,
    };

    const save = async (values: GameFormValues) => {
        const updated = await supabaseGame.set.edit.game(values, gameId);
        if (!updated) return false;

        toast.success(`${updated.name} saved.`);
        await updateGames();
        push(dirHref.games.root);
        return true;
    };

    return (
        <GameForm key={game.id} title="Edit game" description={game.name} initial={initial}
                  currentPlayers={game.players?.length ?? 0} submitLabel="Save changes"
                  cancelHref={dirHref.games.root} onSubmit={save}/>
    );
}
