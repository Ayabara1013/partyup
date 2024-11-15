'use client'

import { useAuthState } from "react-firebase-hooks/auth";

import Dir from "@/components/Dir";
import PageLayout from "@/components/PageLayout";

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { accountLocalStorage } from "@/util/localStorage";
import CharacterSheet from "@/util/character/CharacterSheet";
import chatWindow from "@/app/play/(components)/ChatWindow";
import createDndCharacter from "@/util/character/templates/dndCharacter";
import toast from "react-hot-toast";
import { validateCommand } from "@/util/functions";
import { roll } from "@/app/test-page/rolls";
import Discover from '../discover/page';

import '@styles/home/home.scss';
import '@styles/cta.scss';

import { ExampleHome } from './(components)/ExampleHome';
import Link from 'next/link';
import { HomeWelcome } from './(components)/HomeWelcome';

import alltxt from '@/assets/all_text';

import exampleMobile1 from '../../public/images/example-play-screens-mobile-1x.png';
import CYACard from './(components)/CYACard';

const coolImages = require("cool-images");

// const getRandomCat = require('random-cat-img'); // this is broken for some reason
// const randomPuppy = require('random-puppy');


export default function Home() {
  // const [user] = useAuthState(userAuth);

  return (
    <div className='home-page flex flex-col sm:py-4 md:py-8 lg:pt-8 lg:pb-20 gap-8 lg:gap-28 w-full min-h-full border-2 border-dotted border-red-400'>

      <CallToAction />
      {/* <div className='pt-8 px-12 flex flex-col justify-center align-center'>
        <div className='text-center bg-secondary p-4 text-2xl font-bold text-secondary-content rounded-xl'>cta completed</div>
      </div> */}
      <ChooseYourAdventure />

    </div>
  )

  // return (
  //   <div className='home-page flex-col-4 w-full min-h-full border-2 border-dotted border-red-400'>
      
  //     {/* <div className='flex flex-col absolute top-[5rem] z-10 self-end p-2 gap-1 w-fit'>
  //       <Link href='/home' className='btn btn-sm btn-neutral'>
  //         back to top
  //       </Link>

  //       <Link href='#call-to-action' className='btn btn-sm btn-neutral'>
  //         call to action
  //       </Link>

  //       <Link href='#big-landing-thing' className='btn btn-sm btn-neutral'>
  //         big landing thing
  //       </Link>

  //       <Link href='#features' className='btn btn-sm btn-neutral'>
  //         features
  //       </Link>

  //       <Link href='#actions' className='btn btn-sm btn-neutral'>
  //         actions
  //       </Link>

  //       <Link href='#features-2' className='btn btn-sm btn-neutral'>
  //         features-2
  //       </Link>

  //       <Link href='#community' className='btn btn-sm btn-neutral'>
  //         community
  //       </Link>
  //     </div> */}

  //     <div id='top' className='home__welcome'>
  //       {/* <h1 className='text-8xl font-medium'>welcome to tavern!</h1> */}
  //       <h1 className='home__welcome__header text-8xl font-medium whitespace-normal'>
  //         Welcome to Tavern!
  //       </h1>

  //       {/* <div>weve got this,</div>
  //       <div>and this</div>
  //       <div>aand this</div>
  //       <div>aaand this</div> */}

  //       <div className='border text-4xl m-auto'>
  //         tavern brings you together with you're gaming group, new or old, no matter <span className='text-primary font-bold'>where</span> or <span className='text-primary font-bold uppercase'>when</span> you are
  //       </div>
  //     </div>

      
  //     <HomeWelcome />

  //     <div className='home__cta flex flex-col-4 justify-center'>
  //       <div className='flex justify-evenly gap-4 px-4'>
  //         <div className='home__cta__blocks'>
  //           <div className='__block-header'>games</div>
  //           <div className='__image-block-placeholder'>image goes here</div>
  //         </div>

  //         <div className='home__cta__blocks'>
  //           <div className="__block-header">stories</div>
  //           <div className='__image-block-placeholder'>image goes here</div>
  //         </div>

  //         <div className='home__cta__blocks'>
  //           <div className="__block-header">community</div>
  //           <div className='__image-block-placeholder'>image goes here</div>
  //         </div>

  //         <div className='home__cta__blocks'>
  //           <div className="__block-header">time</div>
  //           <div className='__image-block-placeholder'>image goes here</div>
  //         </div>
  //       </div>

  //     </div>

      


  //     <ExampleHome />

  //     {/* <div className='home__examples  flex flex-col gap-8 py-8 '>
  //       <div className='home__examples__call-to-action  m-auto text-4xl font-medium'>
  //         check out some current games!
  //       </div>

  //       <div
  //         className='home__examples card-gallery  flex flex-col px-4 gap-8 
  //           md:flex-row md:px-8
  //         '>
  //         <GameCard />
  //         <GameCard />
  //         <GameCard />
  //         <GameCard />
  //       </div>
  //     </div> */}

  //     <div className="">
  //       {/* <Discover /> */}
  //       {/* discover section */}
  //     </div>

  //     <div className='prw'>
  //       this is the feed below here
  //     </div>

  //     <div className="home__feed">

  //       <div className='home__feed__section'>
  //         <div className='prw'>
  //           reviews -- element to be manualy populated 
  //         </div>
  //       </div>

  //       <div className='home__feed__section'>
  //         <div className='prw'>
  //           marketing -- element to auto populate 
  //         </div>
  //       </div>

  //       <div className='home__feed__section'>
  //         <div className='prw'>
  //           features -- element to auto populate
  //         </div>
  //       </div>

  //       <div className='home__feed__section'>
  //         <div className='prw'>
  //           updates -- element to auto populate
  //         </div>
  //       </div>

  //       <div className='home__feed__section'>
  //         <div className='prw'>
  //           stuff -- element to auto populate
  //         </div>
  //       </div>

  //       <div className='home__feed__section'>
  //         <div className='prw'>
  //           stuff -- element to auto populate
  //         </div>
  //       </div>

  //     </div>

  //   </div>
  // )
}

function CallToAction(props) {

  return (
    <div className='flex flex-col gap-8'>
      <div className='cta-banner flex flex-col'>
        <div className='cta-header'>welcome to <span className="uppercase">tavern</span></div>
        <div className='cta-subheader'>play <span className="cta-subheader__accent">how</span> you want, <span className="text-accent">when</span> you want</div>
        <div className='cta-subheader'>no scheduling conflicts, <span className="cta-subheader__accent">ever</span> again</div>
      </div>

      <div className='flex gap-2'>
        <div className='flex flex-col flex-auto gap-4 m-auto text-center'>
          <div className='m-auto text-[3rem] font-bold max-w-[75%]'>{alltxt.home.cta_txt_1}</div>
          <button className='btn btn-lg px-12 btn-primary m-auto'>{alltxt.home.cta_btn_1}</button>
        </div>

        <div className='flex flex-auto h-[500px]'>
            <img src='/images/example-play-screens-mobile-1x.png' className='w-full h-full object-scale-down'></img>
        </div>
      </div>
    </div>
  )
}


function ChooseYourAdventure(props) {
  return (
    <div className='flex gap-12 justify-center'>
      <CYACard header={alltxt.home.cya_card_1.header} img="/images/008-spellbook-1.png">
        {alltxt.home.cya_card_1.sub}
      </CYACard>
      <CYACard header={alltxt.home.cya_card_2.header} img="/images/038-adventure-1.png">
        {alltxt.home.cya_card_2.sub}
      </CYACard>
      <CYACard header={alltxt.home.cya_card_3.header} img="/images/042-epidemiology.png">
        {alltxt.home.cya_card_3.sub}
      </CYACard>
      <CYACard header={alltxt.home.cya_card_4.header} img="/images/058-watching-tv.png">
        {alltxt.home.cya_card_4.sub}
      </CYACard>
    </div>
  )
}

function GameCard() {

  const randomImg = coolImages.one(800, 800);
  
  return (
    <div className='game-card flex flex-col col-span-1 justify-center h-full bg-neutral rounded-md overflow-clip'>
      <div className='flex flex-col text-center bg-primary h-12 text-lg'>
        <div className='m-auto'>game name</div>
      </div>

      <div className='game-card__content flex flex-col p-4 gap-2'>
        <div>hello world this is a game</div>

        <img className='text-center aspect-square w-full bg-red-400 rounded shadow-lg shadow-base-200'
          src={randomImg} />
        
        <p className='text-sm'>height fact recall student method community private hat electricity touch single shelf name exactly depend select art official win border buried pot differ glad</p>
      </div>
    </div>
  )
}