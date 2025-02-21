'use client'

import { useEffect, useState } from 'react';
import { Test1, Test2, Test3 } from './testComponents';
import { rollDie, roll, rollv2, rollFate } from '@/util/systems/general/mechanics';

import '@styles/dieShapes.scss';



export default function TestPage() {
  const [diceTestResult, setDiceTestResult] = useState([]);
  
  const box = `border border-1 border-dotted border-red-400`;


  useEffect(() => {
    console.log(`dice results updated`);
    console.log(diceTestResult);
  }, [diceTestResult])

  const handleTest1 = () => {
    rollDie(6)
  }

  const handleTest2 = () => {
    let tally = [0];
    let string = '';

    let array = [2, 2, 2, 2, 2, 2, 2];
    // let array = [0, 2, 0, 0, 0, 0, 0];
    let dice = [4, 6, 8, 10, 12, 20, 100]

    const totalDice = array.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    console.log(`rolling ${totalDice} die, \n${array[0]}d4, \n${array[1]}d6, \n${array[2]}d8, \n${array[3]}d10, \n${array[4]}d12, \n${array[5]}d20, \n${array[6]}d100`); //should be 14
    
    
    for (let die = 0; die < array.length; die++) {
      string += `\n(d${dice[die]}) `;

      for (let count = 0; count < array[die]; count++) {
        // string += `${count + 1}d${dice[die]}, `;

        let result = rollDie(dice[die])
        // console.log(result);

        string += `${result[0]} `;
        
        tally.push([result, dice[die]])
      }
      string.slice(string);
    }

    console.log(string);

    setDiceTestResult(string);
  }

  const handleTest3 = () => {
    let result = roll([[1, 4], [1, 6], [1, 8], [1, 10], [1, 12], [1, 20], [1, 100]]);

    // console.log(result);
  }

  const handleTest4 = () => {
    setDiceTestResult(rollFate(6));
    rollFate(6);
  }

  const handleTest5 = () => {
    let arr = rollv2(1, 2, 3, 2, 1, 1, 1);
    console.log("arr:", arr);
    let counter = 0;

    setDiceTestResult(arr)
    // console.log(`result: `, diceTestResult);
  }

  const handleAddResult = () => {
    setDiceTestResult(prevResults => [
      ...prevResults, 
      [1, 1] // Pushing the array [1, 1]
    ]);
  };

  return (
    <div className={`${box} flex h-full`}>
      <div className={`tb1 m-auto p-2 gap-2`}>
        <div className='tb2 flex gap-2'>
          <button className='btn btn-primary' onClick={handleTest1}>rollDie(6)</button>
          <button className='btn btn-primary' onClick={handleTest2}>roll series</button>
          <button className='btn btn-primary' onClick={handleTest3}>test 3</button>
          <button className='btn btn-primary' onClick={handleTest5}>test 3</button>
          <button className='btn btn-primary' onClick={handleTest4}>roll 6 fate</button>
          <button className='btn btn-primary' onClick={handleAddResult}>add 1,1</button>
          {/* <button className='btn btn-primary' onClick={handleTest5}>roll 6 fate</button> */}
        </div>

        <div className={`tb2 flex gap-2`}>
          {/* {
            diceTestResult.map(([result, sides], index) => (
              <div key={index} className='m-auto p-2 w-8 h-8 min-w-fit min-h-fit bg-neutral rounded-lg text-primary font-bold text-center'>
                {result}
              </div>
            ))
          } */}
          {
            diceTestResult.map((result, index) => (
              <div key={index} className='m-auto p-2 w-8 h-8 min-w-fit min-h-fit bg-neutral rounded-lg text-primary font-bold text-center'>
                {result}
              </div>
            ))
          }
        </div>

      </div>
    </div>
  )
}