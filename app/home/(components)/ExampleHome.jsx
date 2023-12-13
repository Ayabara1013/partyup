'use client'

import '@styles/home/ExampleHome.scss';

import dndlogo from '@/public/images/dungeons-dragons.png';
import Image from 'next/image';
import { FeatureAccordion } from './FeatureAccordion';
import Link from 'next/link';

export function ExampleHome({ className = '' }) {
  return (
    <div className={`${className} example-home-layout relative flex flex-col p-8 gap-4 min-h-44 `}>
      
      

      

      {/* call to action */}
      <Home.Section id={`call-to-action`} className={`call-to-action text-4xl text-medium text-center`}>
        <div>Play <span className="text-primary">your</span> way.</div>
        <div>Any time, <span className="text-primary underline uppercase">Any</span> place.</div>
      </Home.Section>

      {/* big landing thing */}
      <Home.Section id={`big-landing-thing`} className={`justify-center`}>
        <Home.ImgPlaceholder />

        <Home.Header className='font-borel lowercase'>System Agnostic, <span className="underline font-borel">Life</span> Agnostic</Home.Header>

        {/* <div className='home__section __subsection system-example-display '>
          <div className='system-example -1'>dinguns an dwaguns</div>
          <div className='system-example -4 md:row-span-2'>literally anything my dude</div>
          <div className='system-example -2'>paffinga</div>
          <div className='system-example -3'>caww of cafoofoo</div>
          <div className='system-example -5'>vamepiya te maskewade</div>
        </div> */}

        <div className='text-center'>
          
          <p>Join anyone, from anywhere, and play on YOUR schedule.</p>
          <p>play any system, and only be restricted by your imagination</p>
        </div>
      </Home.Section>

      {/* features */}
      <Home.Section id={`features`} className={`justify-center`}>
        <Home.Header className='text-2xl font-major font-semibold text-center'>The <span className="underline font-major">Premiere</span> Play-by-Post TTRPG Platform</Home.Header>
        <Home.Header className='capitalize'><span className="underline">the</span> play-by-post platform</Home.Header>

        <div className=''>
          <div className='text-2xl font-bold text-secondary'>the complete virtual tabletop</div>

          <p>Roll20® is the most complete solution for digital play. Access character sheets, tokens, rulebooks, dice, and more - with powerful tools to automate the tedious stuff.</p>

          <button className='text-primary'>create an account {`{fontawesome arrow ->}`}</button>
        </div>

        <Home.ImgPlaceholder className='' text='big picture thing' />

        <div className=''>
          <ol className='list-decimal list-inside '>
            <li>Drag & Drop Monsters, Characters, & NPCs</li>
            <li>Add Suspense with Dynamic Lighting</li>
            <li>Roll 3D Dice</li>
            <li>Integrated Video & Voice</li>
            <li>Interactive Character Sheets</li>
          </ol>
        </div>
      </Home.Section>

      {/* actions */}
      <Home.Section id={`actions`} className={`justify-center`}>
        <div className=' action-display flex flex-wrap gap-4'>
          <Home.Actions.Card header={'sign up'}></Home.Actions.Card>
          <Home.Actions.Card header={'choose a game'}></Home.Actions.Card>
          <Home.Actions.Card header={'invite friends'}></Home.Actions.Card>
          <Home.Actions.Card header={'play'}></Home.Actions.Card>
        </div>

        <button className='btn btn-primary m-auto'>create a free account</button>
      </Home.Section>

      {/* features-2 */}
      <Home.Section id={`features-2`} className={`justify-center`}>
        <div>
          <FeatureAccordion />
        </div>
      </Home.Section>

      {/* community */}
      <Home.Section id={`community`} className={`justify-center`}>

      </Home.Section>

      <div id="first-section">SECTION 1</div>
      <main id="second-section">SECTION 2</main>
    </div>
  )
}

export const Home = {
  Section: function ({ id, className = '', children, ...props }) {
    return (
      <div id={id} className={`${className} home__section border border-primary py-4 flex ${!className.includes('flex-row') && 'flex-col'} gap-4`}>
        {/* {header && <Home.Header>{header}</Home.Header>} */}
        {children}
      </div>
    )
  },

  Header: function ({ className = '', children, title }) {
    const sizes = ['text-sm', 'text-md', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl', 'text-7xl', 'text-8xl'];
    const hasSize = sizes.some(size => className.includes(size));

    return (
      <h1 className={`${className} home__header tb2 text-primary ${!hasSize && 'text-3xl'} text-center font-bold`}>
        {children || title}
      </h1>
    )
  },

  ImgPlaceholder: function ({ className = '', children, mdWidth = 'w-3/5', mdHeight, aspectRatio = 'aspect-[2/1]', text, ...props }) {

    return (
      <div className={`${className} flex justify-center items-center m-auto p-4 w-full ${aspectRatio} bg-info tb-3 md:m-auto md:${mdWidth}`}>
        <span className=''>{text || 'big picture thing'}</span>
      </div>
    )
  },

  Actions: {
    Card: function ({ className = '', children, header, text, ...props }) {
      return (
        <div className={`${className} action-card ${!className.includes('flex-row') && 'flex-col'} justify-center m-auto px-4 py-8 items-center max-w-md min-h-16 bg-neutral`}>
          {/* {children} */}
          <img src="https://roll20.net/v3/assets/img/icons/icon-sign-up.png" alt=""
            className='action-card__img w-20' />
          
          <div className='action-card__header w-fit'>{header || '{header}'}</div>

          <p className='action-card__text text-center'>
            {text || 'chest meat order biggest seems reason frighten tent electric season fence guard belt chair cloud famous structure women thank income log ten parts careful'}
          </p>
        </div>
      )
    }
  }
}