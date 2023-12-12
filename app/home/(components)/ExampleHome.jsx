'use client'

import '@styles/home/ExampleHome.scss';

import dndlogo from '@/public/images/dungeons-dragons.png';
import Image from 'next/image';
import { FeatureAccordion } from './FeatureAccordion';
import Link from 'next/link';

export function ExampleHome({ className = '' }) {
  return (
    <div className={`${className} example-home-layout flex flex-col p-8 gap-4 min-h-44 `}>
      
      <div className='flex sticky top-0 justify-evenly p-2 bg-base-100'>
        <Link href='#call-to-action' className='btn btn-sm btn-neutral'>
          call to action
        </Link>

        <Link href='#big-landing-thing' className='btn btn-sm btn-neutral'>
          big landing thing
        </Link>

        <Link href='#features' className='btn btn-sm btn-neutral'>
          features
        </Link>

        <Link href='#actions' className='btn btn-sm btn-neutral'>
          actions
        </Link>

        <Link href='#features-2' className='btn btn-sm btn-neutral'>
          features-2
        </Link>

        <Link href='#community' className='btn btn-sm btn-neutral'>
          community
        </Link>
      </div>

      

      {/* call to action */}
      <Home.Section id={`call-to-action`} className={`justify-start`} header={'{call to action}'}>
        <p>we set the table, you play the game. <span className='text-error opacity-75'>{'<ps a lot of this is stolen from roll20 & dndbeyond as templates>'}</span></p>

        <button className='btn btn-primary w-fit'>create free account</button>

        <p>Easily create characters, organize games, purchase content, find players, and customize your story for your group - all in your browser.</p>
      </Home.Section>

      {/* big landing thing */}
      <Home.Section id={`big-landing-thing`} className={`justify-center`} header={`big landing thing`}>
        <Home.ImgPlaceholder />

        <div className='home__section __subsection system-example-display  flex justify-center'>
          <img src={'https://roll20.net/v3/assets/img/logos/dungeons-dragons.png'} alt="Dungeons and Dragons logo" className='' />
          <img src={'https://roll20.net/v3/assets/img/logos/pathfinder2.png'} alt="Dungeons and Dragons logo" className='' />
          <img src={'https://roll20.net/v3/assets/img/logos/call-of-cthulhu.png'} alt="Dungeons and Dragons logo" className='' />
          <img src={'https://roll20.net/v3/assets/img/logos/vampire-logo.png'} alt="Dungeons and Dragons logo" className='' />
        </div>

        <div className='home__section __subsection system-example-display '>
          <div className='system-example -1'>dinguns an dwaguns</div>
          <div className='system-example -4 md:row-span-2'>literally anything my dude</div>
          <div className='system-example -2'>paffinga</div>
          <div className='system-example -3'>caww of cafoofoo</div>
          <div className='system-example -5'>vamepiya te maskewade</div>
        </div>

        <div>
          <p>JOIN OVER 10 MILLION PLAYERS AND GMS PLAYING DUNGEONS AND DRAGONS (AND HUNDREDS MORE SYSTEMS) ONLINE</p>
        </div>
      </Home.Section>

      {/* features */}
      <Home.Section id={`features`} className={`justify-center`} header={`features`}>
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

      <Home.Section id={`actions`} className={`justify-center`} header={`actions`}>
        <div className=' action-display flex flex-wrap gap-4'>
          <Home.Actions.Card header={'sign up'}></Home.Actions.Card>
          <Home.Actions.Card header={'choose a game'}></Home.Actions.Card>
          <Home.Actions.Card header={'invite friends'}></Home.Actions.Card>
          <Home.Actions.Card header={'play'}></Home.Actions.Card>
        </div>

        <button className='btn btn-primary m-auto'>create a free account</button>
      </Home.Section>

      <Home.Section id={`features-2`} className={`justify-center`} header={`features`}>
        <div>
          <FeatureAccordion />
        </div>
      </Home.Section>

      <Home.Section id={`community`} className={`justify-center`} header={`community`}>

      </Home.Section>

      <div id="first-section">SECTION 1</div>
      <main id="second-section">SECTION 2</main>
    </div>
  )
}

export const Home = {
  Section: function ({ id, className = '', children, header, ...props }) {
    return (
      <div id={id} className={`${className} home__section border border-primary flex ${!className.includes('flex-row') && 'flex-col'} gap-4`}>
        {header && <Home.Header>{header}</Home.Header>}
        {children}
      </div>
    )
  },

  Header: function({ className = '', children, title }) {
    return (
      <div className={`${className} home__header tb2 text-primary text-3xl font-bold`}>
        {children || title}
      </div>
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
        <div className={`${className} action-card flex-col-2 justify-center m-auto px-4 py-8 items-center max-w-md min-h-16 bg-neutral`}>
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