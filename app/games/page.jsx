'use client'

import '@styles/games/games.scss'
import {useAccountManager} from '@app/(contexts)/accountManager';
import Link from 'next/link';
import {dirHref} from "@/javascript/assets/directoryHref";
import MyGamesList from "@app/games/(components)/GameList";

export default function MyGames({className}) {
  const {gmGames, playerGames, canCreate} = useAccountManager();

  return (
    (gmGames &&
      <div className={`${className} games-page page-wrapper flex flex-col gap-8`}>
        {(gmGames && gmGames.length > 0) && <MyGamesList gameList={gmGames} type={`gm`}/>}
        {(playerGames && playerGames.length > 0) && <MyGamesList gameList={playerGames}/>}

        <div className='games-page__section --find-more-games mt-auto'>
          <Link href={dirHref.games.create}
                className={`btn-with-breakpoints px-6 ${canCreate() ? '' : 'btn-disabled'}`}>create a game</Link>
          <Link href={dirHref.discover}
                className='btn-with-breakpoints md:px-6 txt-3xl'>find more games</Link>
          <Link href={dirHref.games.root}
                className='btn-with-breakpoints md:px-6 txt-3xl'>return</Link>
        </div>
      </div>
    )
  )
}
