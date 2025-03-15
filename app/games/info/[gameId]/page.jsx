'use client'

import '@styles/games/info/game-info.scss';

import {use, useEffect} from 'react';
import {useApplication} from "@app/(contexts)/application";
import {gameSystems} from "@/javascript/assets/gameSystems";

export default function GameInfo({params}) {
  const {user, gmGames} = useApplication();
  let {gameId} = use(params);
  useEffect(() => {

  }, [])
  // const { item } = props;

  let game = gmGames?.gameList[0];
  // we need to make sure that all the necessary data is held, so I'll check and set that here

  return (
    gmGames &&
    <div className='game-info-page page-wrapper flex flex-col'>
      <div className="tb1 flex flex-col m-auto gap-4 max-w-[70%] bg-neutral">
        <div className='tb2 text-opacity-50'>
          <span className='text-primary text-lg font-semibold'>{game.name}</span>
          <span className='text-secondary'>  - By: {game.uName}</span>
        </div>
        {/* <FakeArticle /> */}

        <div className=' flex gap-2'>
          <div className='tb3 flex-1'>
            <div>System: {gameSystems.valueToTitle[game.system]}</div>
            <div>{game.desc?.length > 0 ? game.desc : `No Description`}</div>
            <div>Started On {game.createdAt.toDate().toLocaleDateString()}</div>
            <div>Game Id: {game.id}</div>
          </div>

          <div className='tb3 flex-col-2 justify-start'>
            {Array(4).fill(null).map((player, index) => (
              <div
                className={`btn btn-sm 
                  ${player
                  ? 'btn-primary text-primary-content hover:btn-accent'
                  : 'btn-outline opacity-75 border-2 text-primary hover:bg-transparent hover:border-accent hover:text-accent hover:opacity100'} 
                  font-medium rounded-md`}
                key={index}>
                {player ? player.username : "Empty"}
              </div>
            ))}
            <button
              className='btn btn-primary opacity-75 btn-sm hover:btn-accent hover:opacity-100'>invite
            </button>
          </div>
        </div>

        <div className='tb2'>
          (dm tools)
        </div>
      </div>
    </div>
  )
}