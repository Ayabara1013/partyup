'use client'

import Link from 'next/link'
import { useApplicationContext } from '@app/ApplicationContext';
import { useEffect } from 'react';




export default function Games({ className }) {
  const { temp, updateTemp } = useApplicationContext();

  const user = temp.user;
  // if (!temp.userTotalGames) updateTemp('userTotalGames', 0);
  // if (!temp.freeAllowedGames) updateTemp('freeAllowedGames', 1);
  // if (!temp.isUserPremium) updateTemp('isUserPremium', false);
  
  const canMakeNewGame = () => {
    if (temp.isUserPremium) return true;
    else if (temp.userTotalGames > temp.freeAllowedGames) return false;
    else return false;
  }
  

  // useEffect(() => {
  //   canMakeNewGame()
  
  //   return () => {
  //     second;
  //   };
  // }, [temp.userTotalGames]);
  

  return (
    <div className={`${className} page-wrapper flex`}>
      <div className='m-auto flex flex-col gap-4'>

        
        <Link href={'/create/game'} className={`btn ${canMakeNewGame() ? 'btn-primary' : 'btn-disabled hover::btn-error'}`} disabled={!canMakeNewGame()} >
          create a game
        </Link>

        <Link href={'/games/my-games'} className={`btn btn-primary`}>
          view my games ({temp.userTotalGames})
        </Link>

        <Link href={'/discover'} className={`btn btn-primary`} >
          find more games
        </Link>

        <button className={`btn btn-accent`} onClick={() => updateTemp('userTotalGames', temp.userTotalGames === 0 ? 3 : 0)}>hello world</button>
      </div>
    </div>
  )
}


// // import Link from 'next/link';
// // import Page from '../page';

// import toast from 'react-hot-toast';

// import '@styles/games/games.scss'
// import { gamesCollection, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
// import { useContext } from 'react';
// import { Application, useApplicationContext } from '../ApplicationContext';

// export default function Games({ className }) {
//   console.clear();
//   // obvious placeholders lol (trying to make things as plug and play while also easy for my testing!)

//   const { temp, setTemp, updateTemp } = useApplicationContext();

//   updateTemp('userTotalGames', 3);
//   updateTemp('freeAllowedGames', 1);
//   updateTemp('isUserPremium', false);

//   const user = temp.user;
//   let userTotalGames = temp.userTotalGames;
//   let freeAllowedGames = temp.freeAllowedGames;
//   let isUserPremium = temp.isUserPremium;

//   const setUserToFree = () => {
//     updateTemp('isUserPremium', false);
//   };

//   const setUserToPremium = () => {
//     updateTemp('isUserPremium', true);
//   }



//   let checkCanMakeGame = () => {
//     if (isUserPremium) return true;
//     else if (userTotalGames < freeAllowedGames) return true;
//     else return false;
//   }
//   let canMakeGame = checkCanMakeGame();

//   let create_game_button_style = !isUserPremium && (userTotalGames > freeAllowedGames) ? 'btn-disabled' : ''; // for invalid numbers

//   const MyGamesList = () => {
//     let list = Object.values(gamesCollection);
//     // console.log(list);


//     return (
//       <ul className='games-page__games-list'>
//         {
//           list.map((game, index) => {
//             let playerCount = game.players.length;
//             let totalSeats = game.totalSeats;
//             let minSeats = game.minSeats;

//             let pcs = '';
//             if (playerCount < totalSeats) {
//               if (playerCount < minSeats) {
//                 pcs = 'text-warning';
//               }
//               else pcs = 'text-neutral-content';
//             }
//             else if (playerCount === totalSeats) pcs = 'text-success';
//             else pcs = 'text-error';  
            
//             if (game.players.includes(user)) { // (game.name === 'Whispers of the Forgotten') { //this is here in case I need to test the final use case of the 
//               return (
//                 <div className='games-page__games-list__item' key={index}>
//                   <GameItemHeader className={``} game={game} system={true} />

//                   <div className="flex gap-2">
//                     <div className={`${pcs} text-xl font-bold whitespace-nowrap`}>
//                       {playerCount} / {totalSeats}
//                     </div>

//                     <PlayersList className={`flex-1 my-auto`} game={game} playerCount={playerCount} totalSeats={totalSeats} />
                    
//                     <div className=''>
//                       <button className='btn btn-xs btn-square btn-accent m-auto font-semibold'>...</button>
//                     </div>
//                   </div>
//                 </div>
//               )
//             }
//           })
//         }
//       </ul>
//     )
//   }      

//   return (
//     <div className={`${className} games-page page-wrapper flex flex-col gap-8`}>
//       <div className='m-auto text-3xl font-semibold'>games</div>

//       <div className='games-page__section --games-list'>
//         <MyGamesList />
//       </div>

//       <div className='games-page__section --find-more-games'>
//         <button className='btn btn-accent button-breakpoints m-auto w-1/2 md:px-6 txt-3xl'>find more games</button>
//         <button className={`btn button-breakpoints m-auto px-6 w-1/2 ${create_game_button_style}`} onClick={() => {canMakeGame ? toast.success('permission true') : toast.error('you do not have permission to make a new game')}}>create a game</button>
//         <button className='btn btn-primary button-breakpoints m-auto px-6 w-1/2' onClick={() =>toast(`hello world`)}>hello world</button>
//       </div>
//     </div>
//   )
// }



// function GameItemHeader({ className, game, ...props }) {
//   return (
//     <div className={`__item-header ${className} flex flex-wrap justify-start items-end gap-x-2`}>
//       <div className='__item-header__name text-2xl font-semibold text-primary'>{game.name}</div>
//       <div className={`${!props.system && 'hidden'} __item-header__system text-opacity-50`}>{game.system}</div>
//     </div>
//   )
// }



// function PlayersList({ className, game, playerCount, totalSeats }) {
//   let remainingSeats = totalSeats - playerCount;

//   const RemainingSeats = () => {
//     let seats = [];

//     for (let i = 0; i < remainingSeats; i++) {
//       seats.push(
//         <li key={i + playerCount + 1} className={`__players-list__item ${i + 1 + playerCount > totalSeats ? '--error' : '--empty'}`}>
//           open
//         </li>
//       )
//     }
//     return <>{seats}</>;
//   }

//   return (
//     <div className={`__players-list ${className}`}>
//       <div className='__players-list__list flex flex-row flex-wrap gap-2'>
//         {/* <div className={`${pcs} text-xl font-bold whitespace-nowrap`}>
//           {playerCount} / {totalSeats}
//         </div> */}

//         {game.players.map((player, index) => {
//           return (
//             <li key={index} className={`__players-list__item ${index + 1 > totalSeats ? '--error' : '--filled'}`}>
//               {player.username}
//             </li>
//           )
//         })}

//         <RemainingSeats />
//       </div>
//     </div>
//   )
// }
