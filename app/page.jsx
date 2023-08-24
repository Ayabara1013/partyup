'use client'

import React, { useState } from 'react';

import ChatWindow from '@/components/ChatWindow';



function Home(props) {
  return (
    <div className='chat-page'>
      <div className='chat-window-row flex flex-row h-full gap-4'>
        <ChatWindow name='Canon' />
        <ChatWindow name='Turn' />
        <ChatWindow name='Open' />
      </div>

      <div className='bottom-row'>

      </div>
    </div>
  )
}



export default Home;