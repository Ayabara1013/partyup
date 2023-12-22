

'use client'

import { useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

import '@styles/play/ChatWindow.scss';



export function ChatWindow({ num = 50, cols, className, windowState, setWindowState, index, name }) {
  const isMediumOrAbove = useMediaQuery({ minWidth: 768 }) // adjust the value as needed

  let elements = [];
  let active = windowState[index];

  for (let i = 0; i < num; i++) {
    elements.push(<li>text {i}</li>);
  }

  const toggleActive = () => {
    let newState = [...windowState];

    for (let i = 0; i < newState.length; i++) {
      i === index ?
        !newState[i] ?
          newState[i] = true
          : null
        : newState[i] = false;
    }

    setWindowState(newState);
  }

  const MessageArea = () => {
    return (
      <>
        <div className={`chat-window__header uppercase`} onClick={toggleActive}>
          {name}
        </div>

        <div className={`message-area flex-col flex-auto h-full overflow-y-hidden`}>
          <div className='message-container flex-auto overflow-y-scroll'>
            <BunchOfElements />
            <BunchOfElements />
          </div>
        </div>
        {/* NOTE!!! using the message area wrapper outside the container stops the input from being squished */}
        <ChatInput active={active} />
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
      <button className='closed-window btn btn-primary w-4 h-full text-xl font-semibold text-primary break-all leading-5' onClick={toggleActive}>
        {/* {active.toString()} */}
        {/* {text()} */}
        {name}
      </button>
    )
  }

  // i am now aware that I could probably just do a closedDiv entirely instead of a chat window with a nested closedDiv but for now Ill keep it like this

  return (
    <div className={`chat-window ${active ? '--active' : '--inactive'} flex flex-col gap-2 h-full min-h-0`}>
      {/* {active ? <MessageArea /> : <ClosedDiv />} */}
      {isMediumOrAbove ? <MessageArea /> : active ? <MessageArea /> : <ClosedDiv />}
    </div>
  )
}




function ChatInput(props) {
  const [value, setValue] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    if (/^[!\/]/.test(value)) {
      setShowPrompt(true);
    }
    else {
      setShowPrompt(false);
    }
  }, [value])

  return (
    <div className={``}>
      <PromptPopup showPrompt={showPrompt} value={value} />

      <input
        type="text"
        value={value}
        placeholder="Type here"
        className="input input-bordered input-primary w-full"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  )
}

function PromptPopup(props) {
  const { showPrompt, value } = props;
  const [options, setOptions] = useState(['stuff']);

  useEffect(() => {
    const store = ['callout', 'roll', 'stuff', 'john', 'steve', 'dave'];
    const filteredOptions = store.filter(item => item.includes(value));
    setOptions(filteredOptions);
  }, [value]); 


  return (
    <div className={`prompt-popup ${showPrompt ? '' : 'hidden'} p-2 min-w-1/2 rounded-lg drop-shadow-md `}>
      <div>
        {options}
      </div>
    </div>
  );
}






const createExampleChatComponents = (num) => {
  let elements = [];
  

  for (let i = 0; i < num; i++) {

  }

  return elements;
}

export const BunchOfElements = () => {
  return (
    <>
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-secondary">What kind of nonsense is this</div>
      </div>
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-accent">Put me on the Council and not make me a Master!??</div>
      </div>
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-info">That's never been done in the history of the Jedi. It's insulting!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-success">Calm down, Anakin.</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-warning">You have been given a great honor.</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-error">To be on the Council at your age.</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble cb-neutral-focus">It's never happened before.</div>
      </div>
    </>
  )
}