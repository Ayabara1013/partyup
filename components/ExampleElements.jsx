import React, { useEffect, useRef, useState } from "react";

import '../styles/ExampleElements.scss'

// font awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faHome, faUser, faPaperPlane, faAnglesDown, faHouse } from '@fortawesome/free-solid-svg-icons';
library.add(faCoffee, faHome, faUser, faPaperPlane, faAnglesDown, faHouse);



function ExampleElements({ numElements = 100 }) {
  const elements = [];

  function ExampleChatMessage({ num }) {
    const senderClass = () => {
      if (num % 2 == 0) return 'sent chat-end';
      else return 'recieved chat-start';
    }

    const colourClass = () => {
      if (num % 2 == 0) return 'chat-bubble-primary';
      else return 'chat-bubble-secondary';
    }

    return (
      <div className={`example-message-element chat ${senderClass()}`}>
        <div className={`chat-bubble ${colourClass()}`}>
          hello world hello world 
        </div>
      </div>
    )
  }
  
  // for (let i = 0; i < numElements; i++) {
  //   elements.push(<div key={i} className='example-message-element sent'>Element {i}</div>);
  // }

  // elements.push(<div key={numElements}>Special Element</div>);
  
  for (let i = 0; i < numElements; i++) {
    elements.push(<ExampleChatMessage key={i} num={i} />)
  }
  
  elements.push(
    <div key={numElements} className='example-message-element sent'>
      <FontAwesomeIcon icon="fa-solid fa-user" />
      <div className='example-message-text'>wee Special Element! also, {numElements}</div>
    </div>
  );
  
    
  return (
    <>
      {elements}
      
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-primary">What kind of nonsense is this</div>
      </div>
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-secondary">Put me on the Council and not make me a Master!??</div>
      </div>
      <div className="chat chat-start">
        <div className="chat-bubble chat-bubble-accent">That's never been done in the history of the Jedi. It's insulting!</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-info">Calm down, Anakin.</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-success">You have been given a great honor.</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-warning">To be on the Council at your age.</div>
      </div>
      <div className="chat chat-end">
        <div className="chat-bubble chat-bubble-error">It's never happened before.</div>
      </div>

      {/* <ExampleElement /> */}
    </>
  )
}

function ExampleElement(props) {
  const { numElements, senderClass, colourClass } = props;
  return (
    <div key={numElements} className={`example-message-element chat ${senderClass || `chat-start`}`}>
      <FontAwesomeIcon icon="fa-solid fa-user" />
      <div className={`chat-bubble ${colourClass || 'chat-bubble-error'}`}>
          wee Special Element! also, {numElements} 
      </div>
      {/* <div className='example-message-text'></div> */}
    </div>
  )
}

export default ExampleElements;

{/* <div className={`example-message-element chat ${senderClass()}`}>
        <div className={`chat-bubble ${colourClass()}`}>
          hello world hello world 
        </div>
      </div> */}