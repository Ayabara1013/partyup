'use client'

import '@/styles/games/games.scss'
import Link from "next/link";
import {dirHref} from "@/lib/routing/directoy";
import {useAuthManager} from "@/app/(context)/authContext";
import MyGamesList from "@/app/games/your-games/(components)/gameList";

export default function Page() {
    const {user, gmGames, playerGames, gamesLoading, updateGames} = useAuthManager();

    return (
        <div className="games-dashboard">
            <MyGamesList
                type="gm" games={gmGames} loading={gamesLoading} userId={user?.id} updateGames={updateGames}
                action={<Link href={dirHref.games.create} className="btn btn-sm btn-primary">Create a game</Link>}
                empty="You aren't running any games yet."/>
            <MyGamesList
                type="player" games={playerGames} loading={gamesLoading} userId={user?.id} updateGames={updateGames}
                action={<Link href={dirHref.discover} className="btn btn-sm btn-ghost border border-neutral-content/20">Find games</Link>}
                empty="You haven't joined any games yet."/>
        </div>
    )
}
