'use client'

import Link from 'next/link'
import {useApplication} from "@app/(contexts)/application";
import {useEffect} from "react";
import {dirHref} from "@/javascript/assets/directoryHref";

export default function Games({className}) {
  const {userDetails, gmGames, setGames, checkUser} = useApplication();
  useEffect(() => {
    checkUser();
  }, []);
  useEffect(() => {
    if (userDetails) {
      setGames();
    }
  }, [userDetails]);
  return (
    <div className={`${className} page-wrapper flex`}>
      {gmGames &&
        <div className='m-auto flex flex-col gap-4'>
          <Link href={dirHref.games.create} disabled={!gmGames.canCreate()}
                className={`btn ${gmGames.canCreate() ? 'btn-primary' : 'btn-disabled hover::btn-error'}`}>
            create a game</Link>

          <Link href={dirHref.games.root} className={`btn btn-primary`}>your games</Link>

          <Link href={dirHref.discover} className={`btn btn-primary`}>find more games</Link>
        </div>
      }
    </div>
  )
}