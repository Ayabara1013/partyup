"use client"

import {useRouter} from "next/navigation";
import {use, useEffect, useRef, useState} from "react";
import {useAuthManager} from "@/app/(context)/authContext";
import PageLayout from "@/components/pageLayout";
import {dirHref} from "@/lib/routing/directoy";
import LoadingUi from "@/components/loadingUi";
import {supabaseGame} from "@/lib/supabase/db/game";
import toast from "react-hot-toast";

type PageProps = {
    params: Promise<{
        inviteCode: string;
    }>;
};


export default function page({params}: PageProps) {
    const {push} = useRouter();
    const [game, setGame] = useState<any | null>(null);
    const {user} = useAuthManager();
    const {inviteCode} = use(params);
    const hasRun = useRef(false);

    useEffect(() => {
        if (inviteCode && user && !hasRun.current) {
            hasRun.current = true;
            supabaseGame.get.game.fromInvite(inviteCode).then((result) => {
                if (result) {
                    setGame(result);
                    supabaseGame.get.joinRequest.exists(result.id, user.id).then(result => {
                        if (!result) return;
                        toast.error(`You already requested to join this game!`)
                        push(dirHref.games.root);
                    })
                }
            })
        }
    }, [user]);

    async function joinGame() {
        if (user) {
            await supabaseGame.set.join(game.id, user.id)
            toast.success(`Join request sent!`)
            push(dirHref.games.root);
        }
    }

    return (
        <PageLayout title={`Join Game: ${game?.name}`} backHref={dirHref.games.root}>
            {(game) ?
                <>
                    <div className="w-full center px-2">
                        <h2 className="w-1/4 flex mt-4 px-2 border">Game Description:</h2>
                        <h2 className="w-3/4 flex mt-4 px-2 border">{game.description}</h2>
                    </div>
                    <div className="w-full center px-2">
                        <h2 className="w-1/4 flex mt-4 px-2 border">DM:</h2>
                        <h2 className="w-3/4 flex mt-4 px-2 border">{game.gm.name}</h2>
                    </div>
                    <div className="w-full flex flex-col px-2">
                        <h2 className="w-full flex mt-4 px-2 border">Players:</h2>
                        <div className="w-full flex flex-col mt-4 px-2 border">
                            {game.players.map((member: any) =>
                                <div key={member.id} className="w-full flex mt-2">{member.name}</div>
                            )}
                            {(game.players.length === 0) && <div className="w-full flex mt-2">No players yet!</div>}
                        </div>
                        <button className="btn mt-5" onClick={joinGame}>Request to Join!</button>
                    </div>
                </>
                : <LoadingUi/>}
        </PageLayout>
    )
}