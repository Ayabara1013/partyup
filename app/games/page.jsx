'use client'

import Link from 'next/link';
import Page from '../page';

import toast from 'react-hot-toast';

import '@styles/games/games.scss'
import { gamesCollection, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import { Seaweed_Script } from 'next/font/google';

export default function Games({ className }) {
  // console.clear();

  // obvious placeholders lol (trying to make things as plug and play while also easy for my testing!)
  const user = usersCollection.user1; 
  const userTotalGames = 3;
  const freeAllowedGames = 1;
  const isUserPremium = false;


  let checkCanMakeGame = () => {
    if (isUserPremium) return true;
    else if (userTotalGames < freeAllowedGames) return true;
    else return false;
  }
  let canMakeGame = checkCanMakeGame();


  
  console.clear();
  // console.log(`%ccan make game? ${canMakeGame}`, 'background-color: indianRed');

  let create_game_button_style = !isUserPremium && (userTotalGames > freeAllowedGames) ? 'btn-error' : ''; // for invalid numbers

  const handleCreateGameClick = (success) => {
    if (success) toast.success('hello!')
    else toast.error(`you have too many games!`);
  }

  const MyGamesList = () => {
    let list = Object.values(gamesCollection);
    console.log(list);

    return (
      <ul className='games-page__games-list'>
        {
          list.map((game, index) => {
            // console.log(`\nscanning list of games >> ${index}: [${list[index].name}]`);
            let playerCount = game.players.length;
            let totalSeats = game.totalSeats;
            let minSeats = game.minSeats;

            let players_count_style =
            playerCount === totalSeats
                ? 'text-success'
                : playerCount > totalSeats
                  ? 'text-error'
                  : playerCount < minSeats
                    ? 'text-warning'
                    : '';
            
            if (game.players.includes(user)) {
              // console.log(
                // `%c[SUCCESS] user is in game [${game.name}]\n`,
              // 'color: lightGreen');

              return (
                <li className='games-page__games-list__item' key={index}>
                  <GameName game={game} system={true} />

                  {/* <SystemName game={game} /> */}
                  
                  {/* <SeatCount style={players_count_style} playerCount={playerCount} totalSeats={totalSeats}  version={1} /> */}

                  <PlayersList game={game} scStyle={players_count_style} playerCount={playerCount} totalSeats={totalSeats} version={1}  />
                  
                </li>
              )
            }
            // else console.log(
            //   `%c[FAILURE] user is not in game [${game.name}]\n`,
            //   'color: indianRed');
          })
        }
      </ul>
    )
  }

  return (
    <div className={`${className} games-page page-wrapper flex-col-4`}>
      <p>games</p>

      <div className='games-page__section'>
        <p className='section-header'>create a game</p>

        <button className={`btn ${create_game_button_style}`} onClick={() => {canMakeGame ? toast.success('permission true') : toast.error('you do not have permission to make a new game')}}>create a game</button>

        <button disabled={true} className='btn btn-primary' onClick={() =>toast(`hello world`)}>toast</button>
      </div>

      <div className='games-page__section'>
        <p className='section-header'>my games</p>

        <MyGamesList />
      </div>

      <div className='games-page__section'>
        <p className='section-header'>find games</p>
      </div>
    </div>
  )
}

function GameName({ game, ...props }) {
  return (
    <div className="__game-name">
      <div className='__game-name__name'>{game.name}</div>
      <div className={`${!props.system && 'hidden'} __game-name__system`}>{game.system}</div>
    </div>
  )
}

function SystemName({ game }) {
  return (
    <div className='__game-system'>
      <p>system: {game.system}</p>
    </div>
  )
}

function SeatCount({ style, playerCount, totalSeats, version }) {
  return (
    <div className='__seats-count'>
      <p className={`${style}`}>players: {playerCount} / {totalSeats}</p>
      <p className={`${style} ${version === 1 && 'hidden'}`}>current players: {playerCount}</p>
      <p className={`${style} ${version === 1 && 'hidden'}`}>total seats: {totalSeats}</p>
      <p className={`${style} ${version === 1 && 'hidden'}`}>remaining seats: {totalSeats - playerCount} </p>
    </div>
  )
}

function PlayersList({ game, scStyle, playerCount, totalSeats, version }) {
  const RemainingSeats = () => {
    let seats = [];
    for (let i = 0; i < totalSeats - playerCount; i++) {
      seats.push(
        <li key={i+playerCount+1} className={`__players-list__item --empty`}>open</li>
      )  
    }
    return seats;
  }

  if (game.name === 'Whispers of the Forgotten') {
    console.clear()

    console.log(game);
  }

  return (
    <div className='__players-list'>
      <SeatCount version={version} style={scStyle} playerCount={playerCount} totalSeats={totalSeats} />

      <ul>
        {game.players.map((player, index) => {
          return <li key={index} className={`__players-list__item --filled`}>{player.username}</li>
        })}

        {playerCount > totalSeats && <RemainingSeats />}
      </ul>
    </div>
  )
}




// export default function Games() {
//   return (
//     <div className={`games-page page-wrapper flex flex-col p-4`}>

//       <div className='border p-4'>
//         <div>your games</div>

//         <div className='bg-neutral'>card 1</div>
//       </div>

//       <div>modify your games</div>

//       <div>game info</div>

//       <div>modify players / roles</div>

//       <div>sort games</div>

//       <div>create a new game</div>


//       <div className='games-list p-1'>
//         <div className='text-xl text-primary font-bold'>
//           your games
//         </div>

//         <div className='flex flex-col gap-2'>
//           <GameCard />
//           <GameCard />
//           <GameCard />
//         </div>
//       </div>

//     </div>
//   )
// }

// function GameCard() {
//   return (
//     <div className='games-list__card flex flex-col p-2 bg-neutral rounded'>
//       <div className='bg-base-200 h-20'>picture</div>
//       <div className='text-primary text-xl'>starborne mercenaries</div>
//       <div>red angle real throw lunch myself parallel today sugar laid vowel break among serious continent war slope tomorrow differ solid wonderful across finally mainly</div>

//       <div className='grid grid-flow-col gap-4 justify-stretch'>
//         <button className='btn btn-primary'>play</button>
//         <button className='btn btn-primary'>edit</button>
//       </div>
//     </div>
//   )
// }



// // export default function Games() {
// //   return (
// //     <div className='games-page page-wrapper flex flex-col items-center'>
// //       <div className='page-header text-3xl text-primary font-semibold'>Games</div>

// //       <div className='tb1 flex flex-wrap justify-center p-6 gap-6 max-w-screen-lg '>
// //         <PageOption title={'create a game'}>create a game</PageOption>
// //         <PageOption title={'manage your games'}>manage your games</PageOption>
// //         <PageOption title={'find a game'}>find a game</PageOption>
// //         <PageOption title={'join a game'}>join a game</PageOption>
// //       </div>
// //     </div>
// //   )
// // }


// // function PageOption({className, title, btnText, children, href, ...props}) {
// //   return (
// //     <div className="card hover:scale-105 transition-all w-96 bg-primary text-primary-content">
// //       <div className="card-body">
// //         <h2 className="card-title text-3xl capitalize">{title ? title : 'Card title!'}</h2>
// //         {children && <p>{children}</p>}

// //         <div className="card-actions justify-end">
// //           <button className="btn btn-ghost">Buy Now</button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }