'use client'

// import Link from 'next/link';
// import Page from '../page';

import toast from 'react-hot-toast';

import '@styles/games/games.scss'
import { gamesCollection, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';

export default function Games({ className }) {
  console.clear();
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

  let create_game_button_style = !isUserPremium && (userTotalGames > freeAllowedGames) ? 'btn-error' : ''; // for invalid numbers

  const MyGamesList = () => {
    let list = Object.values(gamesCollection);
    // console.log(list);

    return (
      <ul className='games-page__games-list'>
        {
          list.map((game, index) => {
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
            
            if (game.players.includes(user)) { // (game.name === 'Whispers of the Forgotten') { //this is here in case I need to test the final use case of the 
              return (
                <li className='games-page__games-list__item' key={index}>
                  <GameItemHeader game={game} system={true} />

                  <PlayersList game={game} scStyle={players_count_style} playerCount={playerCount} totalSeats={totalSeats} version={1}  />
                  
                </li>
              )
            }
          })
        }
      </ul>
    )
  }

  return (
    <div className={`${className} games-page page-wrapper flex flex-col gap-8`}>
      <div className='m-auto text-3xl font-semibold'>games</div>

      <div className='games-page__section --create-game'>
        <div className='section-header'>create a game</div>

        <div className='flex flex-col gap-2 md:flex-row'>
          <button className={`btn px-6 ${create_game_button_style}`} onClick={() => {canMakeGame ? toast.success('permission true') : toast.error('you do not have permission to make a new game')}}>create a game</button>
          <button className='btn btn-primary px-6' onClick={() =>toast(`hello world`)}>hello world</button>
        </div>
      </div>

      <div className='games-page__section --games-list'>
        <div className='section-header'>my games</div>

        <MyGamesList />
      </div>

      <div className='games-page__section --find-more-games'>
        {/* <div className='section-header'>find games</div> */}
        <button className='btn btn-accent m-auto w-1/2 md:px-6 txt-3xl'>find more games</button>
      </div>
    </div>
  )
}

function GameItemHeader({ game, ...props }) {
  return (
    <div className="__item-header flex flex-wrap justify-start items-end gap-x-2">
      <div className='__item-header__name text-2xl font-semibold text-primary'>{game.name}</div>
      <div className={`${!props.system && 'hidden'} __item-header__system text-opacity-50`}>{game.system}</div>
      {/* <div className='__item-header__container tb2'>
      </div> */}
    </div>
  )
}

// function SystemName({ game }) {
//   return (
//     <div className='__game-system'>
//       <p>system: {game.system}</p>
//     </div>
//   )
// }

function SeatCount({ className, style, playerCount, totalSeats }) {
  return (
    // <div className={`__seats-count ${className}`}>
    //   <div className={`${style} ${className}`}>{version !== 1 && 'players: '}{playerCount} / {totalSeats}</div>
    // </div>
    <div className={`__seats-count ${style} ${className} text-nowrap`}>{playerCount} / {totalSeats}</div>
  )
}

function PlayersList({ game, scStyle, playerCount, totalSeats, version }) {
  let remainingSeats = totalSeats - playerCount;

  const RemainingSeats = () => {
    let seats = [];

    for (let i = 0; i < remainingSeats; i++) {

      seats.push(
        <div key={i + playerCount + 1} className={`__players-list__item ${i + 1 + playerCount > totalSeats ? '--error' : '--empty'}`}>
          open
        </div>
      )
    }

    return (
      <>
        {seats}
      </>
    );
  }

  // let playerCount = game.players.length;
  // let totalSeats = game.totalSeats;
  let minSeats = game.minSeats;

  // let players_count_style =
  //   playerCount === totalSeats
  //   ? 'text-success'
  //   : playerCount > totalSeats
  //     ? 'text-error'
  //     : playerCount < minSeats
  //       ? 'text-warning'
  //         : '';

  let pcs = '';
  if (playerCount < totalSeats) {
    if (playerCount < minSeats) pcs = 'text-warning';
  }
  else if (playerCount === totalSeats) pcs = 'text-success';
  else pcs = 'text-error';

  return (
    <div className='__players-list'>
      {/* <SeatCount style={scStyle} playerCount={playerCount} totalSeats={totalSeats} /> */}

      

      <div className='__players-list__list flex flex-row flex-wrap gap-2'>
        <div className={`${pcs} text-xl font-bold whitespace-nowrap`}>
          {playerCount} / {totalSeats}
        </div>

        {game.players.map((player, index) => {
          return (
            <div key={index} className={`__players-list__item ${index + 1 > totalSeats ? '--error' : '--filled'}`}>
              {player.username}
            </div>
          )
        })}

        <RemainingSeats />
      </div>
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