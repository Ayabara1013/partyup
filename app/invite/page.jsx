'use client'


import { charactersCollection, gamesCollection, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import findCharacterByUserId from '@/util/findCharacterByUserId';
import { useState } from 'react';



let numberOfMissingPlayers = 2;
let targetGame = gamesCollection.game1;



export default function Invite(props) {
  const [slotState, setSlotState] = useState([true, true, true, true, false])


  return (
    <div className={`invite-page tb1 h-full flex`}>
      <div className='border border-secondary flex flex-col m-auto p-4 gap-4 w-1/2 bg-neutral rounded-xl'>
        <div className='text-center uppercase text-xl text-primary font-bold'>
          invite a player
        </div>

        <div className='border border-primary p-2 rounded-lg text-center text-opacity-50'>enter email</div>

        <div className='flex flex-col gap-4'>
          <div className='font-medium'>current players</div>
          {
            Object.values(usersCollection).map((user, index) => {
              let playerCharacter = findCharacterByUserId(user.uid);

              // console.log(user);
              if (index < targetGame.players.length - numberOfMissingPlayers) {
                return (
                  // <div className='invite-panel__player-listing flex px-2 py-1 gap-2 bg-neutral-content bg-opacity-20 rounded-lg'>
                  //   <div className='text-primary'>
                  //     {index + 1}/{targetGame.players.length}
                  //   </div>

                  //   <div>
                  //     <span className="font-semibold">{user.username}</span>{' as '}
                  //     <span className="font-semibold">{playerCharacter.name}</span>
                  //   </div>
                  // </div>

                  <FilledSlot user={user} playerCharacter={playerCharacter} targetGame={targetGame} index={index} />
                )
              }
              else {
                return (
                  // <div className='p-2 text-primary-content rounded-lg text-opacity-50'>
                  //   <span className='p-1 bg-neutral-content bg-opacity-40 rounded-lg'>{`${index + 1}/${targetGame.players.length}`}</span>{' '}
                  //   <span>unfilled</span>
                  // </div>

                  <EmptySlot targetGame={targetGame} index={index} slotState={slotState} />
                )
              }
            })
          }
        </div>

        <button className='btn btn-primary m-auto px-6'>confirm</button>

      </div>
    </div>
  )
}

/**
 * 
 * @param {*} user 
 * @param {*} playerCharacter 
 * @param {*} targetGame 
 * @param {*} index 
 * @returns 
 */
function FilledSlot({ user, playerCharacter, targetGame, index }) {
  return (
    <div key={index} className='invite-panel__player-listing flex px-2 py-1 gap-2 bg-neutral-content bg-opacity-20 rounded-lg'>
      <div className='text-primary'>
        {index + 1}/{targetGame.players.length}
      </div>

      <div>
        <span className="font-semibold">{user.username}</span>{' as '}
        <span className="font-semibold">{playerCharacter.name}</span>
      </div>
    </div>
  )
}

function EmptySlot({ targetGame, index, slotState }) {
  console.log(slotState[index])

  let borderStyle = slotState[index] ? 'border border-primary' : '';
  let textStyle = slotState[index] ? 'text-primary' : 'text-neutral-content  text-opacity-50';
  // im separating these into 2 different variables in case theres ever a need to do something separate with them in the future, 
  // ^ confirmed by me putting in the text-primary and text-opacity-50 classes

  return (
    <div key={index} className={`${borderStyle} ${textStyle} invite-panel__player-listing flex px-2 py-1 gap-2 bg-neutral-content bg-opacity-20 rounded-lg`}>
      <div>{index + 1}/{targetGame.players.length}</div>
      <div>{slotState[index] ? "that dude's email" : 'unfilled' }</div>
    </div>
    // <div className='p-2 text-primary-content rounded-lg text-opacity-50'>
    //   <span className='p-1 bg-neutral-content bg-opacity-40 rounded-lg'>{`${index + 1}/${targetGame.players.length}`}</span>{' '}
    //   <span>unfilled</span>
    // </div>
  )
}