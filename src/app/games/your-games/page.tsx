'use client'

import '@/styles/games/games.scss'
import Link from "next/link";
import {dirHref} from "@/lib/routing/directoy";
import {useAuthManager} from "@/app/(context)/authContext";
import MyGamesList from "@/app/games/your-games/(components)/GameList";

export default function page() {
    const {gmGames, playerGames, updateGames} = useAuthManager();

    return (
        <div className="flex flex-col min-h-0 gap-4 h-full">
            <div className="flex flex-row min-h-0 gap-6 h-full p-10">
                {(gmGames) && <MyGamesList gameList={gmGames} type={`gm`}/>}
                {(playerGames) && <MyGamesList gameList={playerGames}/>}
            </div>

            <div className='games-page__section --find-more-games mt-auto mb-10'>
                <Link href={dirHref.games.create}
                      className={`btn-with-breakpoints px-6 ${true ? '' : 'btn-disabled'}`}>create a game</Link>
                <Link href={dirHref.discover}
                      className='btn-with-breakpoints md:px-6 txt-3xl'>find more games</Link>
                {/*<Link href={dirHref.games.root}*/}
                {/*      className='btn-with-breakpoints md:px-6 txt-3xl'>return</Link>*/}
            </div>
        </div>
    )
}