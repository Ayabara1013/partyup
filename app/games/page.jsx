'use client'

import Link from 'next/link'
import {useApplication} from "@app/(contexts)/application";
import {useEffect} from "react";


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
          <Link href={'/games/create'}
                className={`btn ${gmGames.canCreate() ? 'btn-primary' : 'btn-disabled hover::btn-error'}`}
                disabled={!gmGames.canCreate()}>
            create a game
          </Link>

          <Link href={'/games/my-games'} className={`btn btn-primary`}>
            your games
          </Link>

          <Link href={'/discover'} className={`btn btn-primary`}>
            find more games
          </Link>

          <button className={`btn btn-accent`}>Count Games</button>
        </div>
      }
    </div>
  )
}