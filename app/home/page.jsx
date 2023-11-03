'use client'
import { useAuthState } from "react-firebase-hooks/auth";

import { userAuth } from "@/javascript/firebase/base";
import { accountLocalStorage } from "@/javascript/localStorage";

import Discover from '../discover/page';

const coolImages = require("cool-images");


// const getRandomCat = require('random-cat-img'); // this is broken for some reason
// const randomPuppy = require('random-puppy');


export default function Home() {
  const [ user ] = useAuthState(userAuth);

  let gameId = user ? accountLocalStorage.getCurrentGame(user?.uid) : false;
  let props = {
    disabled: gameId,
    ...(!gameId) && { gameId }
  };

  // const test = () => {
  //   let character = createDndCharacter(
  //       {
  //         strength: 15,
  //       },
  //       {
  //         athletics: {
  //           proficiency: true,
  //           expertise: false,
  //         },
  //         sleightOfHand: {
  //           proficiency: true,
  //           expertise: true,
  //         }
  //       },
  //     4
  //   ); 

  //   let commands = [
  //     '!r 1d20 fire - 2d12 acid + strength + 2',
  //     '!r 3d6 psychic + 3d20 - 4d4 - athletics + 2',
  //     '!r 6d4 lightning - 2d12 + intelligence - 2'
  //   ];

  //   let outputDice = [];
  //   let rollResults = [];

  //   for (const command of commands) {
  //     outputDice.push(validateCommand(command, 'dnd', character).dice);
  //   }

  //   for (const dice of outputDice) {
  //     rollResults.push(roll(dice));
  //   }

  //   for(let i = 0; i < outputDice.length; i++){
  //     console.log(commands[i]);
  //     console.log(outputDice[i]);
  //     console.log(rollResults[i]);
  //   }
  // }

  return (
    <div className='home w-full h-full border'>
      <div className='home__welcome border'>
        <h1 className='text-8xl font-medium'>welcome to tavern!</h1>

        <div>weve got this,</div>

        <div>and this</div>

        <div>aand this</div>

        <div>aaand this</div>
      </div>

      <div className='home__examples flex flex-col gap-8 py-12 border'>
        <div className='w-4/5 border ms-16 text-5xl font-medium'>check out some current games!</div>

        {/* <div className='home__examples__card-gallery grid grid-cols-4 m-auto gap-8 w-4/5 border border-indigo-600'>
          <GameCard />
          <GameCard />
          <GameCard />
          <GameCard />
        </div> */}
      </div>

      <div className='home__some-blurb'>
      </div>

      <Discover/>
    </div>
  )
}

function GameCard() {

  const randomImg = coolImages.one(800, 800);

  return (
    <div className='game-card flex flex-col col-span-1 justify-center 
                    h-full bg-neutral rounded-md overflow-clip'>
      <div className='flex flex-col text-center bg-primary h-12 text-lg'>
        <div className='m-auto'>game name</div>
      </div>

      <div className='game-card__content flex flex-col p-4 gap-2'>
        <div>hello world this is a game</div>

        <img className='text-center aspect-square w-full bg-red-400 rounded shadow-lg shadow-base-200'
             src={randomImg}/>

        <p className='text-sm'>height fact recall student method community private hat electricity touch single shelf
          name exactly depend select art official win border buried pot differ glad</p>
      </div>
    </div>
  )
}