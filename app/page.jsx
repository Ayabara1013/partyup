'use client'

import Image from 'next/image'
import '../styles/ExampleElements.scss';
import ChatWindow from '@/components/ChatWindow';
import React, { useState } from 'react';
import ScrollableBox from '../components/ScrollableBox';

export default function Home(props) {
  return (
    <div>
      <ScrollableBox />
    </div>
  )
}



function generateMessages(count) {
  let messages = [];
  for (let i = 0; i < count; i++) {
    let cl = i % 2 ? 'sent' : 'received';
    messages.push(<div className={cl}>message {i}</div>);
  }
  return messages;
}

// function ChatWindow(props) {
//   return (
//     <div className='box w-1/2 overflow-x-hidden'
//       style={{
//         position: "relative", 
//         height: "100%", 
//         'overflow-y': "scroll"
//        }}
//     >
//       <div
//         style={{
//           position: "relative"
//         }}
//       >
//         {/* {children} */}
//         <ExampleElements numElements={20}/>
//       </div>
//     </div>
//   )
// }

export function ExampleElements({ numElements = 100 }) {
  const elements = [];

  function ExampleChatMessage({ num }) {
    const senderClass = () => {
      if (num % 2 == 0) return 'sent';
      else return 'recieved';
    }

    return (
      <div className={`example-message-element ${senderClass()}`}>
        {/* <FontAwesomeIcon icon="fa-solid fa-user" /> */}
        <div className='example-message-text'>Element {num}</div>
      </div>
    )
  }
  
  for (let i = 0; i < numElements; i++) {
    elements.push(<ExampleChatMessage key={i} num={i} />)
  }
  
  elements.push(
    <div key={numElements} className='example-message-element sent'>
      {/* <FontAwesomeIcon icon="fa-solid fa-user" /> */}
      <div className='example-message-text'>wee Special Element! also, {numElements}</div>
    </div>
  );
  
    
  return (
    <>
      {elements}
      
      <div className='example-message-element'>warning</div>
      <div className='example-message-element recieved'>recieved</div>
      <div className='example-message-element sent'>sent</div>
    </>
  )
}