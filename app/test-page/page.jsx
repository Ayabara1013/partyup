import React from 'react';
import { Test1, Test2, Test3 } from './testComponents';



const box = `border-1-dotted border-red-400`;

export default function TestPage() {

  return (
    <div className={`${box} p-2 `}>
      
      <div className={`${box} p-2`}>
        chat box
      </div>

      <div className={`${box} p-2 column bg-slate-600`}>
        <h1 className='text-xl font-bold'>rolls</h1>

        <Test1 />
        <Test2 />
        <Test3 />
      
      </div>
    </div>
  )
}


