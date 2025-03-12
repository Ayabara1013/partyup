'use client';


import {ChatWindow} from '@app/games/play/[gameId]/(components)/chatWindow'
import '@styles/play/play.scss'
import {useState} from "react";

export default function Play(props) {

  const messages = [
    ' dsFgsg ',
    'dsa fds fsdf sdf',
    ' fghj',
    'kuy  jrty redfsf',
    ' dsvfz aw  fs  ff',
    ' kdtuyd ytg ',
  ];
  return (
    <div className={`play-page h-full`}>
      <div className='chat-row flex p-2 gap-2'>
        <ChatWindow {...{messages}} name={'canon'}/>
        <ChatWindow {...{messages}} name={'turn'}/>
        <ChatWindow {...{messages}} name={'open'}/>
      </div>

      <div className='tool-row flex p-2 gap-4'>
        <div className='tool-row__element'>
          tools
        </div>

        <div className='tool-row__element '>
          tracker
        </div>
      </div>

    </div>
  )
}