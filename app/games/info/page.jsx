'use client'

import '@styles/games/info/game-info.scss';

import { content } from '@/app/discover/page';
import PlayerListing from '@/app/games/info/(components)/PlayerListing';
import { useState } from 'react';


export default function GameInfo(props) {
  // const { item } = props;

  const playersCurrent = content.players.current;
  const playersMax = content.players.max;
  const playersRemaining = playersMax - playersCurrent;


  const displayPlayers = () => {
    return content.players.list.map((player, i) => {
      // console.log(player);
      return <PlayerListing key={i} player={player} index={i}  />
    })
  }

  const displayEmptySlots = () => {
    const [text, setText] = useState('empty');

    for (let i = 0; i < playersRemaining; i++) {
      return (
        <div className='empty-slot flex p-4 justify-center shadow-xl'
          onMouseEnter={() => setText('add a player?')}
          onMouseLeave={() => setText('empty')}
        >
          <div className='text-lg'>{text}</div>
        </div>
      )
    }
  }

  return (
    <div className='game-info page-wrapper'>
      <div className='banner'>
        <img src={content.imageUrl} alt="" className='w-full' />
        <div className='banner__play-button'>PLAY</div>
      </div>

      <div className='details-wrapper flex flex-col border p-4'>
        <div className='text-xl text-primary'>game name</div>
        <div className='flex justify-between'>
          <div>
            <div>system - dnd 5re</div>
            <div>players - 4/5</div>
            <div>dm - @name</div>
          </div>

          <button className='btn btn-primary'>edit</button>
        </div>

        <div className='divider'></div>

        <div>
          forth earth score small inch cold send take information branch rich simple rocky division slight underline attempt ride health rate heard require film certain
        </div>

        <div className='divider'></div>

        <div className='flex flex-col gap-4'>
          <div className='text-xl text-primary'>players</div>

          <div className='border'>
            <div className='text-lg'>active players</div>
            <div className='flex gap-2 justify-center'>
              <button className='btn btn-sm btn-primary'>@KateAdkins</button>
              <button className='btn btn-sm btn-neutral text-primary'>@xXKittenLoverXx</button>
              <button className='btn btn-sm btn-neutral text-primary'>@JohnCena</button>
            </div>
          </div>

          <ExamplePlayerCard />
          <ExamplePlayerCard playerName='@xXKittenLoverXx'/>
          <ExamplePlayerCard playerName="@JohnCena" />
        </div>

      </div>
    </div>
  )

  return (
    <div className={`game-info `}>
      <div className='banner'>
        <img src={content.imageUrl} alt="" className='w-full' />
        <div className='banner__play-button'>PLAY</div>
      </div>

      <div className="details-wrapper grid grid-flow-row-dense grid-cols-3 
      px-4 py-16 gap-x-8 gap-y-16">
        <PageTitle />

        <GameDetails />

        <InfoCard playersCurrent={playersCurrent} playersMax={playersMax} playersRemaining={playersRemaining} />

        <PlayersCard content={content} playersRemaining={playersRemaining} displayPlayers={displayPlayers} displayEmptySlots={displayEmptySlots} />

        <div className='story col-span-full grid grid-cols-3 gap-4'>
          <div className='story__header col-span-full text-3xl text-primary font-black text-center'>
            The Story So Far:
          </div>

          <div className='story__article-wrapper col-span-2'>
            <div className='story-so-far article-overflow-wrapper overflow-hidden'>
              <FakeArticle />
            </div>
          </div>

          <div className='table-of-contents flex flex-col justify-center'>
            <ul>
              <li><a href="#act-1">act 1</a></li>
              <ul className='ms-4'>
                <li><a href="#the-beginning">the beginning</a></li>
                <li><a href="#the-qube">the q-ube</a></li>
              </ul>

              <li><a href="#act-2">act 2</a></li>

              <ul className='ms-4'>
                <li><a href="#the-arena">the arena</a></li>
                <li><a href="#round-1">round 1</a></li>
                <li><a href="#junker-town">junker town</a></li>
                <li><a href="#the-myconids">the myconids</a></li>
              </ul>

            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

function ExamplePlayerCard({playerName = "KateAdkins", characterName = '"Cloud" Mountain Tree', characterRace = 'Tabaxi', characterClass = 'Bard', ...props}) {
  return (
    <div className='flex p-4 bg-neutral rounded items-center'>
      <div>
        <div>
          <span className='text-primary hover:underline'>{playerName}</span> as <span className='text-primary hover:underline'>{characterName}</span> the <span className='text-primary hover:underline'>{characterRace} {characterClass}</span>
        </div>

        <div>Role: Player</div>
      </div>

      <div className="flex flex-col gap-2">
        <button className='btn btn-sm btn-primary'>edit</button>
        <button className='btn btn-sm btn-primary'>active</button>
      </div>
    </div>
  )
}


function PageTitle(props) {
  return (
    <div className='page-title col-span-full 
    text-5xl font-bold text-center text-primary'>
      {content.name}
    </div>
  )
}

function GameDetails(props) {
  return (
    <div className='game-details col-span-2 flex flex-col justify-center p-6 
    bg-neutral rounded-lg shadow-xl' >
      <article className='prose prose-p:mb-2 prose-headings:underline w-full max-w-full'>
        {content.description}
      </article>
    </div>
  )
}

function InfoCard({playersCurrent, playersMax, playersRemaining}) {
  return (
    <div className='info-card whitespace-nowrap p-6
    bg-neutral shadow-xl rounded-lg'>
      <div>players</div>
      <div>
        {playersCurrent}/{playersMax} ({playersRemaining} spots remaining)
      </div>
      <div>plays every : x days or whatever</div>
      <div>some other details</div>
    </div>
  )
}

function PlayersCard({ content, playersRemaining, displayPlayers, displayEmptySlots }) {
  return (
    <div className='players-card col-span-full grid grid-cols-3 px-6 gap-4 rounded-lg whitespace-nowrap'>
      <div className='text-3xl col-span-full font-bold text-center text-secondary'>Starring</div>
      {displayPlayers()}
      {displayEmptySlots()}
    </div>
  )
}

const FakeArticle = () => {
  return (
    <article className='prose m-auto p-8 h-full snap-y rounded-lg scroll-smooth overflow-y-scroll floating-scroll'>
      <h1 id='act-1' >Act 1</h1>
      <h2 id='the-beginning' >The Beginning</h2>
      <p>You have woken up on a mysterious planet, completely unaware of where you are or how you got there.</p>
      <p>bring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>
      <p>twice coat safe husband repeat break printed national pie church muscle together against climb sun night seed probably theory school enemy coach easier movingbring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>
      <p>obtain voice lying welcome after secret without value sand sail popular missing beside human making cool design should author available leaf tide built systembring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>
      <p>upon traffic master attempt pet energy importance poet dust horn realize desk thin week characteristic factory manufacturing independent jungle field shout speak silver surprisebring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>
      <p>exciting tears actual mostly belt salt border identity sail vegetable joined indicate buried planning written glad previous everyone how species examine bare trouble musicalbring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>
      <p>nice perhaps slight mad driver anybody wish race football got society blind aloud film shut parallel citizen action tiny gold combine earlier mostly usebring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>

      <h2 id='the-qube'>the Q-ube</h2>

      <p>part leave amount forth unless hill although sale physical lungs acres army sing joined give force chain indeed studying it fastened complex strength grow</p>
      
      <h1 id='act-2'>act 2</h1>

      <h2 id='the-arena'>The Arena</h2>
      <p>obtain voice lying welcome after secret without value sand sail popular missing beside human making cool design should author available leaf tide built systembring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>
      <p>upon traffic master attempt pet energy importance poet dust horn realize desk thin week characteristic factory manufacturing independent jungle field shout speak silver surprisebring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>
      
      <h2 id='round-1'>round 1</h2>
      <p>obtain voice lying welcome after secret without value sand sail popular missing beside human making cool design should author available leaf tide built systembring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>
      <p>upon traffic master attempt pet energy importance poet dust horn realize desk thin week characteristic factory manufacturing independent jungle field shout speak silver surprisebring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>

      <h2 id='junker-town' >junker town</h2>
      <p>obtain voice lying welcome after secret without value sand sail popular missing beside human making cool design should author available leaf tide built systembring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>
      <p>upon traffic master attempt pet energy importance poet dust horn realize desk thin week characteristic factory manufacturing independent jungle field shout speak silver surprisebring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>

      <h2 id='the-myconids' >the myconids</h2>
      <p>obtain voice lying welcome after secret without value sand sail popular missing beside human making cool design should author available leaf tide built systembring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>
      <p>upon traffic master attempt pet energy importance poet dust horn realize desk thin week characteristic factory manufacturing independent jungle field shout speak silver surprisebring opinion correctly magic order train rather constantly valuable lift swimming stock sight who wonder given where satellites farmer please matter policeman found cast</p>

    </article>
  )
}