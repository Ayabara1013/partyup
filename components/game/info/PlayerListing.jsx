'use client'

import { starborne, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import './PlayerListing.scss';


export default function PlayerListing({ player }) {
  
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
    if (starborne.players[player.uid].role === 'game master') {
      return (
        <div className="flex justify-center items-center gap-2">
          <div className='player-name text-lg'>
            {player.username}
          </div>

          <div className='text-sm'>as</div>
          
          <div className='character-name text-lg'>
            the Game Master
          </div>
        </div>
      )
    }
    
    return (
      <div className="flex justify-center items-center gap-2">
        <div className='player-name text-lg'>
          {player.username}
        </div>

        <div className='text-sm'>as</div>
        
        <div className='character-name text-lg'>
          {starborne.players[player.uid].characterName}
        </div>
      </div>
    )
  }

  return (
    <div className={`player-listing flex flex-col`}>
      <NameCard />

      <div>
        <div className='player-status text-xs text-center'>
          last online {player.lastActive} ago
        </div>
      </div>
    </div>
  )
}

