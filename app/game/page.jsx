// 'use client'

import React from 'react';

import ChatWindow from '@/components/ChatWindow';



function Game(props) {
  return (
    <div className='chat-page'>
      <div className='chat-window-row flex flex-row h-full gap-4'>
        <ChatWindow name='Canon' />
        <ChatWindow name='Turn' />
        <ChatWindow name='Open' />
      </div>

      {/* <div className='bottom-row min-h-24 p-4 m-4'>
        bottom row
      </div> */}
    </div>
  )
}



export default Game;