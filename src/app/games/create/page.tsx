"use client"

import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {dirHref} from "@/lib/routing/directoy";
import {useAuthManager} from "@/app/(context)/authContext";
import {supabaseGame} from "@/lib/supabase/db/game";
import GameForm, {GameFormValues} from "@/app/games/(components)/GameForm";

export default function CreateGamePage() {
    const {push} = useRouter();
    const {user, updateGames} = useAuthManager();

    const create = async (values: GameFormValues) => {
        if (!user) return false;
        const game = await supabaseGame.set.create.game(user.id, values);
        if (!game) return false;

        toast.success(`${game.name} created.`);
        await updateGames();
        push(dirHref.games.root);
        return true;
    };

    return (
        <GameForm title="Create a game" description="You'll be the GM" submitLabel="Create game"
                  cancelHref={dirHref.games.root} onSubmit={create}/>
    );
}
