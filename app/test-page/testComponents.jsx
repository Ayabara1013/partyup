'use client'

import React from 'react';
import {displayRollResults2, roll, rollDie } from './rolls';




const defHeaderTextClass = 'text-center text-lg font-semibold';

function RollTestButton(props) {
  const { children, name = 'this is a test', result } = props;

  return (
    <div className='p-2 w-fit bg-slate-400 rounded-lg'>
      <h1 className={`${defHeaderTextClass}`}>
        {name}
      </h1>

      {children}

      <div className={`${defHeaderTextClass}`}>
        {Object.values(result).join(', ')}
      </div>
    </div>
  )
}

export function Test1(props) {
  const [result, setResult] = React.useState(0);
  
  const handleClick = () => {
    setResult(rollDie(6));
  }

  return (
    <RollTestButton name={`rollDie()`} result={result}>
      <button className='btn' onClick={handleClick}>
        roll 1d6
      </button>
    </RollTestButton>
  )
}

export function Test2(props) {
  const [result, setResult] = React.useState(0);

  const handleClick = () => {
    // setResult({2: 2, no: 3});
    /**
     * this wasnt a good test, I may want to parse the result into a string with parseRollResult
     */

    const rollResult = roll([
      [2, 6], [1, 4], [5, 'strength']
    ]);

    console.log(`--- rollResult--- `);
    console.log(displayRollResults2(rollResult));
    
    // setResult(
    //   // displayRollResults(result.rolls, result.sum)
    //   displayRollResults2(result.rolls, result.sum)
    // )
  }

  return (
    <RollTestButton name={`roll2()`} result={result}>
      <button className='btn' onClick={handleClick}>
        roll 2d6 + 1d4 + 5
      </button>
    </RollTestButton>
  )
}
