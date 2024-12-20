"use client"


import { useState } from 'react'



const parameterLimits = {
  systems: [],
  maxAllowedPlayers: 4,
}

export default function GameCreate({ className }) {
  const [params, setParams] = useState({
    name: '',
    system: '',
    maxPlayers: 0,
  })

  let displayMaxUserWarning = 'display-none';

  const handleMaxPlayerChange = (newValue) => {
    setParams((prevParams) => {
      let updatedParams = {...prevParams};
      updatedParams.maxPlayers = newValue;
      return updatedParams;
    })
  }


  return (
    <div className={`${className} game-create-page tb1 flex h-full m-auto justify-center`}>
      <div className='flex-col-4 my-auto p-8 bg-neutral w-[60vw] rounded-xl'>
        <div>create your game</div>

        {/* enter game name */}
        <div className='flex flex-col'>
          <p>what is the name of your game?</p>
          <input
            type="text"
            placeholder="what is the name of your game?"
            className="input input-bordered input-primary w-full" />
        </div>

        {/* select system */}
        <div className='flex flex-col'>
          <p>what system will you be using?</p>
          <select className="select select-primary w-full">
            <option disabled selected>what system do you want to use?</option>
            <option value={'dnd5e'}>Dungeons & Dragons 5e</option>
            <option value={'pf2e'}>Pathfinder 2e</option>
            <option value={'fae'}>Fate Accelerated</option>
            <option value={'swade'}>Savage Worlds</option>
          </select>
        </div>

        {/* enter max players */}
        <div className='flex flex-col gap-2'>
          <p>enter your preffered number of players <span className="opacity-50">(not including yourself)</span></p>
          <div className='flex'>
            <input
              type="text"
              placeholder="maximum number of players"
              className="flex-1 input input-bordered input-primary w-full"
              onChange={(e) => handleMaxPlayerChange(e.target.value)}
            />
            
            <div className={`${params.maxPlayers > parameterLimits.maxAllowedPlayers ? '' :'hidden'} none m-auto text-warning opacity-50`}>the maximum number of free players is 4, <a className='underline'>click here to upgrade</a></div>
            <ValidCheck itemCheck={params.maxPlayers} itemLimit={parameterLimits.maxAllowedPlayers} />
          </div>

          {/* <div className={`${params.maxPlayers <= parameterLimits.allowedMaxPlayers}`}>good!</div> */}
        </div>

        <div>
          <p>select your safety checks: (optional) <span className="opacity-50">you can change these in the future!</span></p>
          <div className='flex gap-2'>
            <SafetyChecks safetyChecks={['queer', 'sa', 'trigger warnings', 'ryg light']} />
          </div>
        </div>

        <div>
          <p>add tags to your game: (optional) <span className="opacity-50">you can change these in the future!</span></p>

          <input
          type="text"
          placeholder="input tags"
          className="input input-bordered input-primary w-full" />
        </div>

        {/*  the confirm button needs to check if all the fields are valid! */}
        <button className='btn btn-primary m-auto'>confirm</button> 
      </div>
    </div>
  )
}


function Badge({ name, className }) {
  const [state, setState] = useState('inactive'); // this could be a bool, I was just unsure if there was going to be a need for a specific 3rd option

  const handleClick = () => {
    if (state === 'inactive') setState('active');
    else if (state === 'active') setState('inactive');

    console.log(`poop`);
  }

  return (
    <button className={`px-4 btn ${state === 'inactive' ? 'btn-outline' : 'btn-primary'} ${className} btn-xs rounded-full`} onClick={handleClick}>{name || `badge`}</button>
  )
}

function ValidCheck({ itemCheck, itemLimit }) {
  let display = 0 < itemCheck <= itemLimit ? '' : 'hidden';
  
  return (
    <div className={`${display} m-auto text-success font-semibold`}>good!</div>
  )
}


function SafetyChecks({ safetyChecks, className }) {

  Object.keys(safetyChecks).map((item, index) => {
    return (
      <Badge name={item} index={index} key={index} />
    )
  })

  return (
    <div className='flex gap-2'>
      {
        Object.values(safetyChecks).map((item, index) => {
          return (
            <Badge name={item} index={index} key={index} />
          )
        })
      }
    </div>
  )
}