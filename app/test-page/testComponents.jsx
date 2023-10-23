'use client'

import React from 'react';
import {displayRollResults, roll, rollDie, typedRoll } from './rolls';




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
        {result}
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

    // const rollResult = roll([
    //   [2, 6], [2,6,'fire'], [1, 4], [-2, 'strength']
    // ]);

    const rollResult = roll(`!roll 2d6 + 1d10 + 5`);

    console.log(`--- rollResult--- `);

    // const rollString = displayRollResults(rollResult);

    // console.log(rollResult);

    // setResult(rollString);
  }

  return (
    <RollTestButton name={`roll2()`} result={result}>
      <button className='btn' onClick={handleClick}>
        roll 2d6 + 1d4 + 5
      </button>
    </RollTestButton>
  )
}


export function Test3(props) {
  const [result, setResult] = React.useState(0);
  const testRolls = [
    [2, 6], [2,6,'fire'], [1, 4], [-2, 'strength']
  ]
  
  const handleClick = () => {
    console.log(`--- testRolls ---`)
    for (const item of testRolls) console.log(item)
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

