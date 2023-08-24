'use client'

import React from 'react';
import ExampleElements from './ExampleElements';

import '../styles/ChatWindow.scss';

// font awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faHome, faUser, faPaperPlane, faAnglesDown, faHouse } from '@fortawesome/free-solid-svg-icons';
library.add(faCoffee, faHome, faUser, faPaperPlane, faAnglesDown, faHouse);


export default function ChatWindow(props) {
  const { name } = props;
  return (
    <div className='chat-window w-full p-2 gap-2 rounded-xl'>
      <div className='text-center font-bold text-3xl w-full'>
        <FontAwesomeIcon icon="fa-solid fa-user" />
        {name}
      </div>
      {/* <FontAwesomeIcon icon="fa-solid fa-user" /> */}
      <div className="message-container">
        {/* message-container flex flex-col smooth-scroll p-2 border */}

        <ExampleElements numElements={20} />
      </div>

      <InputField />

      
    </div>
  )
}

function InputField(props) {
  return (
    <div className='chat-text-input flex gap-2'>
      <input type="text" placeholder="Type here" className="input input-bordered input-secondary w-full" />

      <button className="btn">
        <FontAwesomeIcon icon="fa-solid fa-paper-plane icon" />
        send
      </button>
    </div>
  )
}