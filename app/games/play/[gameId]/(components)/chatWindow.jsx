'use client'

import '@styles/play/ChatWindow.scss';
import ChatInput from "@app/games/play/[gameId]/(components)/chatInput";
import msgArrayManip from "@/javascript/util/msgArrayManip";


export function ChatWindow({messages, game, uid, className, name}) {
  function toggleActive(e) {
    e.target.parentElement.classList.toggle('--active');
    e.target.parentElement.classList.toggle('--inactive');
  }

  const messageElements = () => {
    let outputElements = [];
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];

      //check if previous message was by current player to display header name/icon. Displays for very first message.
      // let applyHeader = i === 0 || (messages[i - 1]?.uid !== message.uid);
      // message.orderStyle = applyHeader ? 'header' : ''

      if (message[name]) {
        outputElements.push(message);
      }
    }
    console.log({before: outputElements})
    msgArrayManip.sortByCreated(outputElements);
    console.log({after: outputElements})
    return outputElements.map((message, i) => {
      return <ChatMessage key={i} {...{uid, message}}/>
    })
  }

  return (
    <div className={`--active chat-window flex flex-col gap-2 h-full min-h-0 `}>
      <div className={`chat-window__header uppercase full-element-btn`} onClick={toggleActive}>
        <p>{name}</p>
      </div>

      <div className={`message-area flex-col flex-auto h-full overflow-y-hidden`}>
        <div className='message-container flex-auto overflow-y-scroll'>
          {messageElements()}
        </div>
      </div>
      {(game?.gm.id === uid || name !== `canon`) &&
        <ChatInput className={`input input-bordered input-primary w-full`} {...{name, gid: game?.id}}/>}

    </div>
  )
}

function ChatMessage({message, uid}) {
  return (
    <div className={`chat chat-${message.uid === uid ? `end` : `start`} `}>
      <div className="chat-bubble chat-bubble-success">{message.text}</div>
    </div>
  )
}