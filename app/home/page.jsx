'use client'

import coolImages from "cool-images";

// const getRandomCat = require('random-cat-img'); // this is broken for some reason
// const randomPuppy = require('random-puppy');


export default function Page() {
  return (
    <div className='home-page w-full h-full border'>
      <div className='border'>
        <h1 className='text-8xl font-medium'>welcome to tavern!</h1>

        <div>weve got this,</div>

        <div>and this</div>

        <div>aand this</div>

        <div>aaand this</div>
      </div>

      <div className='home-discover-region flex flex-col gap-8 py-12 border'>
        <div className='text-5xl font-medium'>check out our games!</div>

        <div className='game-card-gallery grid grid-cols-4 m-auto gap-8 w-4/5'>
          <GameCard />
          <GameCard />
          <GameCard />
          <GameCard />
        </div>
      </div>
    </div>
  )
}



function GameCard() {

  const randomImg = coolImages.one(800, 800);

  return (
    <div className='game-card flex flex-col col-span-1 justify-center bg-neutral rounded-md overflow-clip'>
      <div className='flex flex-col text-center bg-primary h-12 text-lg'>
        <div className='m-auto'>game name</div>
      </div>

      <div className='game-card__content flex flex-col p-4 gap-2'>
        <div>hello world this is a game</div>

        <img className='text-center aspect-square w-full bg-red-400 rounded shadow-lg shadow-base-200'
             src={randomImg} alt="random-img"/>

        <p className='text-sm'>height fact recall student method community private hat electricity touch single shelf name exactly depend select art official win border buried pot differ glad</p>
      </div>
    </div>
  )
}