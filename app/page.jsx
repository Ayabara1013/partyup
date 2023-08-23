'use client'

import React, { useState } from 'react';
import ScrollableBox from '../components/ScrollableBox';
import ExampleElements from '@/components/ExampleElements';




export default function Home(props) {
  return (
    <div className='chat-page'>
      <div className='chat-window-row flex flex-row h-full gap-2'>
        <ChatWindow name={'Canon'} />
        <ChatWindow name={'Turn'} />
        <ChatWindow name={'Open'} />
      </div>

      <div className='bottom-row'>

      </div>
    </div>
  )
}

function ChatWindow(props) {
  const { name } = props;
  return (
    <div className='chat-window flex w-full flex-col p-2 gap-2'>
      <h1 className='text-center text-3xl font-bold'>{name}</h1>
      <div className="message-container flex  flex-col smooth-scroll">
        {/* {Array.from({ length: 60 }, (_, index) => (
          <div
            key={index}
            className='chat-message flex items-center justify-center py-2'>
            {index + 1}
          </div>
        ))} */}

        <ExampleElements numElements={50} />
      </div>

      <input />
    </div>
  )
}