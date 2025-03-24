'use client'

import '@styles/play/ChatWindow.scss';
import ChatInput from "@app/games/play/[gameId]/(components)/chatInput";
import msgArrayManip from "@/javascript/util/msgArrayManip";
import MessageRenderer from "@app/games/play/[gameId]/(components)/messageRenderer";


export function ChatWindow({messages, game, uid, players, name}) {
  function toggleActive(e) {
    e.target.parentElement.classList.toggle('--active');
    e.target.parentElement.classList.toggle('--inactive');
  }

  const messageElements = () => {
    let outputMessages = [];
    for (let i = 0; i < messages.length; i++) {
      let message = messages[i];

      //check if previous message was by current player to display header name/icon. Displays for very first message.
      if (message[name]) {
        let pushedMessage = structuredClone(message);
        pushedMessage.header = i === 0 || (outputMessages[outputMessages.length - 1]?.uid !== pushedMessage.uid)
        outputMessages.push(pushedMessage);
      }
    }
    msgArrayManip.sortByCreated(outputMessages);
    return outputMessages.map((message, i) => {
      return <ChatMessage key={i} {...{uid, message, players}}/>
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
        <ChatInput className={`input input-bordered input-primary w-full`} {...{name, gid: game.id, players}}/>}

    </div>
  )
}

function ChatMessage({message, players, uid}) {
  let name = (message.uid === `system`) ? `System` : players[message.uid].uName

  return (
    <div className={`custom-chat `}>
      {message.header &&
        <div className="chat-header">
          {name}
          <time className="text-xs opacity-50"></time>
        </div>
      }
      <div className={`chat-bubble chat-bubble-primary w-full`}>
        <MessageRenderer messageText={message.text} players={players}/>
      </div>
    </div>
  )
}