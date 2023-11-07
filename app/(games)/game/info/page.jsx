'use client'

import './game-info.scss';

import { content } from '@/app/discover/page';
import PlayerListing from '@/components/game/info/PlayerListing';




export default function GameInfo(props) {
  // const { item } = props;

  const playersCurrent = content.players.current;
  const playersMax = content.players.max;
  const playersRemaining = playersMax - playersCurrent;


  const displayPlayers = () => {
    return content.players.list.map((player, i) => {
      // console.log(player);
      return <PlayerListing key={i} player={player} />
    })
  }

  const displayEmptySlots = () => {
    for (let i = 0; i < playersRemaining; i++) {
      return (
        <div className='empty-slot flex p-4 justify-center'>
          <div className='text-lg'>empty</div>
        </div>
      )
    }
  }



  return (
    <div className={`game-info tb3 pb-24`}>
      <img src={content.imageUrl} alt="" />

      <div className='page-title text-5xl font-bold text-center text-primary p-8 tb2'>
        {content.name}
      </div>

      <div className="details-wrapper grid grid-flow-row-dense grid-cols-3 tb1 p-4 gap-8">

        <div className='game-details flex flex-col col-span-2 p-6 bg-neutral tb1 rounded-lg justify-center' >
          <article className='prose prose-p:mb-2 prose-p:text-justify prose-headings:underline tb2 w-full max-w-full'>
            {content.description}
          </article>
        </div>

        <div className='info-card border border-sucess whitespace-nowrap'>
          <div>players</div>
          <div>{playersCurrent}/{playersMax} ({playersRemaining} spots remaining)</div>
        </div>

        <div className='players-card col-span-full p-6 bg-neutral rounded-lg whitespace-nowrap'>
          <div className='text-xl font-bold'>players</div>
          <div className="grid grid-cols-3 gap-4">
            {displayPlayers()}
            {displayEmptySlots()}
          </div>
        </div>


      </div>
    </div>
  )
}