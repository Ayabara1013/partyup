import React from "react";

import '../styles/ExampleElements.scss'

// font awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faHome, faUser, faPaperPlane, faAnglesDown, faHouse } from '@fortawesome/free-solid-svg-icons';
library.add(faCoffee, faHome, faUser, faPaperPlane, faAnglesDown, faHouse);



function ExampleElements({ numElements = 100 }) {
  const elements = [];

  function ExampleChatMessage({ num }) {

    const senderClass = (num % 2 == 0) ? 'chat-end' : 'chat-start';
    const colourClass = (num % 2 == 0) ? 'chat-bubble-primary' : 'chat-bubble-secondary';

    return (
      <div className={`chat ${senderClass}`}>
        <div className={`chat-bubble ${colourClass}`}>
          hello world hello world 
        </div>
      </div>
    )
  }
  
  for (let i = 0; i < numElements; i++) {
    elements.push(<ExampleChatMessage key={i} num={i} />)
  }
    
  return (
    <>
      {elements}
      <ExampleStart />
      <ExampleEnd />
    </>
  )
}

function ExampleElement(props) {
  const { numElements, senderClass, colourClass } = props;
  return (
    <div key={numElements} className={`chat chat`}>
      <div className={`chat-bubble chat-bubble-primary`}>
        hello world hello world
      </div>
    </div>
  )
}

export const ExampleStart = () => {
  return (
    <>
      <div className="chat chat-start">
        <div className="chat-bubble">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In iaculis nibh commodo turpis porttitor, eu condimentum libero fringilla. Quisque nibh ipsum, pulvinar sed mi sed, blandit dapibus risus. Nullam in elementum sem.
        </div>
      </div>
    </>
  )
}

export const ExampleEnd = () => {
  return (
    <>
      <div className="chat chat-end">
        <div className="chat-bubble">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In iaculis nibh commodo turpis porttitor, eu condimentum libero fringilla. Quisque nibh ipsum, pulvinar sed mi sed, blandit dapibus risus. Nullam in elementum sem.
        </div>
      </div>
    </>
  )
}

export default ExampleElements;