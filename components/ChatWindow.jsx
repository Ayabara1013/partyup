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
      <h1 className='text-center text-3xl font-bold'><FontAwesomeIcon icon="fa-solid fa-user" />{name}</h1>
      {/* <FontAwesomeIcon icon="fa-solid fa-user" /> */}
      <div className="message-container">
        {/* message-container flex flex-col smooth-scroll p-2 border */}
        {/* {Array.from({ length: 60 }, (_, index) => (
          <div
            key={index}
            className='chat-message flex items-center justify-center py-2'>
            {index + 1}
          </div>
        ))} */}

        <ExampleElements numElements={20} />
      </div>

      {/* <div className="message-area box">
        <div className="chat chat-start">
          <div className="chat-bubble">It's over Anakin, <br/>I have the high ground.</div>
        </div>
        <div className="chat chat-end">
          <div className="chat-bubble">It's over Anakin, <br/>I have the high ground.</div>
        </div>
      </div> */}

      <ExampleStart />
      <ExampleEnd />

      <InputField />

      
    </div>
  )
}

const ExampleStart = () => {
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

const ExampleEnd = () => {
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


function InputField(props) {
  return (
    <div className='chat-text-input flex gap-2'>
      <input type="text" placeholder="Type here" className="input input-bordered input-secondary w-full" />

      <button className="btn"><FontAwesomeIcon icon="fa-solid fa-paper-plane" /></button>
    </div>
  )
}