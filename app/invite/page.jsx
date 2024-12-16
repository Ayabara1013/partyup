'use client'


import { charactersCollection, gamesCollection, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import findCharacterByUserId from '@/util/findCharacterByUserId';
import { useState } from 'react';



// let numberOfMissingPlayers = 2;
// let targetGame = gamesCollection.game1;
// let totalSeats = 5;


// // I dont know why there may be an occasion to use the number of open seats to check the game, but thats what im doing atm now so shush
// const getSeats = (numberOfMissingPlayers, targetGame, totalSeats) => {
//   let seats = [];

//   for (let i = 0; i < totalSeats; i++) {
//     if (i < totalSeats - numberOfMissingPlayers) {
//       seats.push(targetGame.players[i]);
//       console.log(seats);
//     }
//   }
// }



let targetGame = gamesCollection.game1;
let numberOfMissingPlayers = targetGame.totalSeats - targetGame.players.length;
// let numberOfMissingPlayers = 2;
let totalSeats = targetGame.totalSeats;

console.clear();
console.log(targetGame.name, totalSeats, numberOfMissingPlayers)


export default function Invite(props) {
  const [seatState, setSeatState] = useState(() => {
    let seats = [];
    
    for (let i = 0; i < totalSeats; i++) {
      if (targetGame.players[i]) {
        seats.push(targetGame.players[i])
      }
      else seats.push('empty')
    }

    // console.clear();
    console.log('current seat array');
    console.log(seats);
    console.log('------------------------------------------');  

    return seats;
  })

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
          {/* {
            Object.values(usersCollection).map((user, index) => {
              let playerCharacter = findCharacterByUserId(user.uid);

              // console.log(user);
              if (index < targetGame.players.length - numberOfMissingPlayers) {
                return <FilledSlot user={user} playerCharacter={playerCharacter} targetGame={targetGame} index={index} key={index} />
              }
              else {
                return <EmptySlot targetGame={targetGame} index={index} seatState={seatState} key={index} />
              }
            })
          }

          {
            seats.map {
            
            }
          } */}

          {/* <p>there are {seatState.length} total seats</p>
          <p>there are {} open seats</p> */}

          <SeatsList targetGame={targetGame} seatState={seatState} />
        </div>

        <button className='btn btn-primary m-auto px-6'>confirm</button>

      </div>
    </div>
  )
}
// console.log(seatState);
function SeatsList({targetGame, seatState}) {

  let seats = [];

  for (let i = 0; i < seatState.length; i++) {
    if (seatState[i] === 'empty') {
      seats.push(<EmptySlot targetGame={targetGame} seatState={seatState} index={i} key={i} />)
    }
    else {
      let user = seatState[i];

      console.log(`user: `, user)

      console.log(`--find by user id------------------------------------`)
      console.log(findCharacterByUserId(user.uid))
      console.log(findCharacterByUserId(user.uid).name)
      
      seats.push(<FilledSlot user={user} playerCharacter={findCharacterByUserId(user.uid)} targetGame={targetGame} index={i} key={i} />)
    }
  }


  return (
    <div className='flex gap-2'>
      {seats}
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

function EmptySlot({ targetGame, index, seatState }) {
  // console.log(seatState[index])

  let borderStyle = seatState[index] !== 'empty' ? 'border border-primary' : '';
  let textStyle = seatState[index] !== 'empty' ? 'text-primary' : 'text-neutral-content  text-opacity-50';
  // im separating these into 2 different variables in case theres ever a need to do something separate with them in the future, 
  // ^ confirmed by me putting in the text-primary and text-opacity-50 classes

  return (
    <div key={index} className={`${borderStyle} ${textStyle} invite-panel__player-listing flex p-1 gap-2 bg-neutral-content bg-opacity-20 rounded-lg`}>
      <div className='m-auto ps-1'>
        {index + 1}/{targetGame.players.length}
      </div>

      <div className='flex-1 m-auto'>
        {seatState[index] !== 'empty' ? "that dude's email" : 'unfilled'}
      </div>

      {seatState[index] ? <UndoInviteButton seatState={seatState} index={index} /> : null}
    </div>
  )
}

// theres the option of just passing in the bool of the slot, but its also quite possible that more data will be needed, eg, it will very likely need a function to remove that user
function UndoInviteButton(seatState, index) {
  return (
    <button className={`${seatState[index] == false ? 'display-none' : ''} btn btn-ghost btn-xs hover:btn-accent`}>x</button>
  )
}