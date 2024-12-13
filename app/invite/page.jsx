'use client'


import { charactersCollection, gamesCollection, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import findCharacterByUserId from '@/util/findCharacterByUserId';
import { useState } from 'react';



let numberOfMissingPlayers = 2;
let targetGame = gamesCollection.game1;
let totalSeats = 5;


// I dont know why there may be an occasion to use the number of open seats to check the game, but thats what im doing atm now so shush
const getSeats = (numberOfMissingPlayers, targetGame, totalSeats) => {
  let seats = [];

  for (let i = 0; i < totalSeats; i++) {
    if (i < totalSeats - numberOfMissingPlayers) {
      seats.push(targetGame.players[i]);
      console.log(seats);
    }
  }
}



export default function Invite(props) {
  const [slotState, setSlotState] = useState([true, true, true, true, false])

  // const [seats, setSeats] = useState((totalSeats, slotState, numberOfMissingPlayers) => {
  //   let seats = [];
  //   for (i = 0; i < totalSeats; i++) {
  //     if (i =)
  //   }
  // })

  const [seats, setSeats] = useState(getSeats(numberOfMissingPlayers, targetGame, totalSeats))


  return (
    <div className={`invite-page tb1 h-full flex`}>
      <div className='border border-secondary flex flex-col m-auto p-4 gap-4 w-1/2 bg-neutral rounded-xl'>
        <div className='text-center uppercase text-xl text-primary font-bold'>
          invite a player
        </div>

        {/* <div className='input border border-primary rounded-lg text-center text-opacity-50'>enter email, this is not an actual text box rn</div> */}

        <input
          type="text"
          placeholder="enter email or username"
          className="input input-bordered input-info w-full max-w-xs" />

        <div className='flex flex-col gap-4'>
          <div className='font-medium'>current players</div>
          {
            Object.values(usersCollection).map((user, index) => {
              let playerCharacter = findCharacterByUserId(user.uid);

              // console.log(user);
              if (index < targetGame.players.length - numberOfMissingPlayers) {
                return <FilledSlot user={user} playerCharacter={playerCharacter} targetGame={targetGame} index={index} />
              }
              else {
                return <EmptySlot targetGame={targetGame} index={index} slotState={slotState} />
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
    <div key={index} className='invite-panel__player-listing flex p-1 gap-2 bg-neutral-content bg-opacity-20 rounded-lg'>
      <div className='text-primary m-auto ps-1'>
        {index + 1}/{targetGame.players.length}
      </div>

      <div className='flex-1 m-auto'>
        <span className="font-semibold">{user.username}</span>{' as '}
        <span className="font-semibold">{playerCharacter.name}</span>
      </div>

      {/* <button className='btn btn-primary btn-sm p-1 h-auto hover:btn-accent text-xs'>remove</button> */}
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
    <div key={index} className={`${borderStyle} ${textStyle} invite-panel__player-listing flex p-1 gap-2 bg-neutral-content bg-opacity-20 rounded-lg`}>
      <div className='m-auto ps-1'>
        {index + 1}/{targetGame.players.length}
      </div>

      <div className='flex-1 m-auto'>
        {slotState[index] ? "that dude's email" : 'unfilled'}
      </div>

      {slotState[index] ? <UndoInviteButton slotState={slotState} index={index} /> : null}
    </div>
  )
}

// theres the option of just passing in the bool of the slot, but its also quite possible that more data will be needed, eg, it will very likely need a function to remove that user
function UndoInviteButton(slotState, index) {
  return (
    <button className={`${slotState[index] == false ? 'display-none' : ''} btn btn-ghost btn-xs hover:btn-accent`}>x</button>
  )
}