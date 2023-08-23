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
      if (num % 2 == 0) return 'sent';
      else return 'recieved';
    }

    return (
      <div className={`example-message-element ${senderClass()}`}>
        <FontAwesomeIcon icon="fa-solid fa-user" />
        <div className='example-message-text'>Element {num}</div>
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
      
      <div className='example-message-element'>warning</div>
      <div className='example-message-element recieved'>recieved</div>
      <div className='example-message-element sent'>sent</div>
    </>
  )
}

export default ExampleElements;