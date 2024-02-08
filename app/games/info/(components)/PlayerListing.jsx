'use client'

import { starborne, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import '@styles/games/info/PlayerListing.scss';

const coolImages = require("cool-images");

const img = ['https://unsplash.it/200/200?image=997', 'https://unsplash.it/200/200?image=547', 'https://unsplash.it/200/200?image=89'];


const classes = ['', 'Spellslinger Gunman', 'Adult Bed-Wetter Toxicant', 'Card Battle Weeb Summoner', 'Artillerist Mech-Pilot']

export default function PlayerListing({ player, index }) {

  const type = starborne.players[player.uid].role === 'game master' ? 'gm' : 'player';
  
  function getUserByUid(uid) {
    for (let key in usersCollection) {
      if (usersCollection[key].uid === uid) {
        return usersCollection[key];
      }
    }
    return null; // return null if no user with the given uid is found
  }
  const user = getUserByUid(player.uid);

  function NameCard() {
    return (
      <div className='flex flex-wrap '>
        <div className='player-name text-lg'>
          {player.username}
        </div>

        <div className='text-sm'>as</div>
        
        <div className='character-name text-lg'>
          {type === 'gm' ? 'the Game Master' : starborne.players[player.uid].characterName}
        </div>
      </div>
    )
  }

  // return (
  //   <div className='player-listing flex player-listing  p-2 gap-2'>
  //     <div className='player-thumbnail h-full  aspect-square'>
  //       <img src={img[0]} alt="" className='avatar object-cover' />
  //     </div>


  //     <div className={`player-info flex flex-col p-2 `}>
  //       <NameCard />
  //       <div className={`${type === 'gm' ? 'hidden' : ''} player-class m-auto text-sm`}>
  //         the <span className='text-secondary'>{classes[index]}</span>
  //       </div>
  //       <div>
  //         <div className='player-status text-xs text-center'>
  //           last online {player.lastActive} ago
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )

  return (
    <div className='player-listing flex grow items-center overflow-clip shadow-lg bg-neutral border-primary'>

      <div className='player-thumbnail hidden md:block h-full shadow-lg shadow-base-100'>
        <img src='https://unsplash.it/100/100?image=997' alt="" className='h-full aspect-square' />
      </div>

      {/* <img src='https://unsplash.it/100/100?image=997' alt="" className='object-fit' /> */}

      <div className='player-info flex flex-col grow p-4 gap-1 text-center justify-between'>

        <div className='player-info__name-card text-lg'>
          <span className='player-name'>Jack Johnson</span> <span className='text-sm'>as</span> <span className="character-name">Trandor the Destroyer</span>
        </div>

        <div className='player-info__class text-sm'>
          the <span className="text-secondary">Basic Ass Fighter</span>
        </div>

        <div className='player-info__last-active text-sm text-nc-op50'>
          last active 1 month, 2 days ago
        </div>

      </div>
    </div>
  )
}

