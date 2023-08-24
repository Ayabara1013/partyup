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
      if (num % 2 == 0) return 'chat-end';
      else return 'chat-start';
    }

    const colourClass = () => {
      if (num % 2 == 0) return 'chat-bubble-primary';
      else return 'chat-bubble-secondary';
    }

    return (
      <div className={`chat ${senderClass()}`}>
        <div className={`chat-bubble ${colourClass()}`}>
          hello world hello world 
        </div>
      </div>
    )
  }
  
  for (let i = 0; i < numElements; i++) {
    elements.push(<ExampleChatMessage key={i} num={i} />)
  }
  
  // elements.push(
  //   <div key={numElements} className='example-message-element sent'>
  //     <FontAwesomeIcon icon="fa-solid fa-user" />
  //     <div className='example-message-text'>wee Special Element! also, {numElements}</div>
  //   </div>
  // );
    
  return (
    <>
      {elements}

      
    </>
  )
}

function ExampleElement(props) {
  const { numElements, senderClass, colourClass } = props;
  return (
    <div key={numElements} className={`chat ${senderClass || `chat-start`}`}>
      <FontAwesomeIcon icon="fa-solid fa-user" />
      <div className={`chat-bubble ${colourClass || 'chat-bubble-error'}`}>
          wee Special Element! also, {numElements} 
      </div>
      {/* <div className='example-message-text'></div> */}
    </div>
  )
}

export default ExampleElements;