'use client'

import {useEffect, useMemo, useState} from 'react';
import {useMediaQuery} from 'react-responsive';

import '@styles/play/ChatWindow.scss';
import ChatInput from "@app/games/play/[gameId]/(components)/chatInput";


export function ChatWindow({messages, className, index, name}) {
  const isMediumOrAbove = useMediaQuery({minWidth: 768})

  function toggleActive(e) {
    e.target.parentElement.classList.toggle('--active');
    e.target.parentElement.classList.toggle('--inactive');
  }

  const messageElements = () => {
    let finalChat = [];
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];

      //check if previous message was by current player to display header name/icon. Displays for very first message.
      let applyHeader = i === 0 || (messages[i - 1]?.uid !== message.uid);
      message.orderStyle = applyHeader ? 'header' : ''
      finalChat.push(message);
    }

    return finalChat.map((message, i) => {
      return <ChatMessage player={{color: `secondary`}} message={message} key={i}/>
    })
  }


  const MessageArea = () => {
    return (
      <>
        <div className={`chat-window__header uppercase full-element-btn`} onClick={toggleActive}>
          <p>{name}</p>
        </div>

        <div className={`message-area flex-col flex-auto h-full overflow-y-hidden`}>
          <div className='message-container flex-auto overflow-y-scroll'>
            {/*something here messages loading*/}
          </div>
        </div>
        {/* NOTE!!! using the message area wrapper outside the container stops the input from being squished */}
        <ChatInput className={`input input-bordered input-primary w-full`}/>
      </>
    )
  }

  const ClosedDiv = () => {
    const text = () => {
      if (index === 0) return 'canon';
      if (index === 1) return 'turn';
      if (index === 2) return 'open';
    }

    return (
      <button
        className='closed-window btn btn-primary w-4 h-full text-xl font-semibold text-primary break-all leading-5'
        onClick={toggleActive}>
        {/* {active.toString()} */}
        {/* {text()} */}
        {name}
      </button>
    )
  }

  return (
    <div className={`--active chat-window flex flex-col gap-2 h-full min-h-0 `}>
      {/* {active ? <MessageArea /> : <ClosedDiv />} */}
      {/*{isMediumOrAbove ? <MessageArea/> : active ? <MessageArea/> : <ClosedDiv/>}*/}
      <MessageArea/>
    </div>
  )
}