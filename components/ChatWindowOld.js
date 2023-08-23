// major frameworks + external files
import React, { useEffect, useRef, useState } from "react";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// external components
import { Button, Container, Form, FormControl, Row } from "react-bootstrap";
import { useCollectionData, useCollection } from "react-firebase-hooks/firestore";

// my files
import ChatMessage from "./ChatMessage";
import ExampleElements from './ExampleElements';
import { auth, firestore, firebase } from '../firebase';
import { doc } from '@firebase/firestore';

// import lastMessage from '../storage/Storage';


// -------------------------------------------

function ChatWindow(props) {
  // --- Firestore references
  const messagesRef = firestore.collection('messages'); // this is my fs collection by the name of messages
  const query = messagesRef.orderBy('createdAt').limitToLast(25); // this will only query the last 25 messages

  const [messages, loading] = useCollectionData(query, { idField: 'id' }); // Firestore data retrieval hook
  // *** temporarily removed the loading state or whatever

  console.log('printing messages: ...')
  // console.log(messages);

  const [formValue, setFormValue] = useState(''); // State for message input
  
  const chatRef = useRef();
  const messagesEndRef = useRef(null);
  // const messageContainerRef = useRef(null);

  const [scrollPosition, setScrollPosition] = useState(9001);
  /**
   * - chatRef is the DOM reference being used for scrolling.
   * - I changed the name from dummy to chatRef for clarity
   * - the variable refers to the span hidden at the bottom of the chat thats used for targeting the scroll
   */  

  // --- start the element scrolled to the bottom --- //
  useEffect(() => {
    if (chatRef.current) {
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
    console.log("chatRef.current.scrollTop: ", chatRef.current.scrollTop);
    console.log("chatRef.current.scrollHeight: ", chatRef.current.scrollHeight);
    }
  }, []);
    
  useEffect(() => {
    // console.log(messages);
  }, [messages]);
 
  // Function to send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    // Add a new message to Firestore collection
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    // Clear the input field
    setFormValue('');
    chatRef.current.scrollIntoView({ behavior: 'smooth' });
  }

  const isElementScrolledToBottom = () => {
    const element = chatRef.current;
    if (element) {
      return element.scrollTop >= element.scrollHeight - element.clientHeight;
    }
    return false;
  };
  
  // Scroll to the bottom of the message field
  function scrollToBottom(ref) {
    ref.current.scrollIntoView({ behavior: 'smooth' });
  }

  // if (loading) { // Check for loading state and display "Loading..." if true
  //   return <div>Loading...</div>;
  // }

  const onScroll = () => {
    const ref = chatRef.current;
    const scrollTop = ref.scrollTop;
    const maxScrollTop = ref.scrollHeight - ref.clientHeight;
    const invertedScrollTop = maxScrollTop - scrollTop;

    /**
     * scroll top gets the num of pixels an element is scrolled vertically downwards,
     * -- this is shown in how far from the top it is, basically the lower you scroll, the higher the num
     * scroll height gets the total height that can be scrolled
     * client height gets the height of the view shown
     * 
     * what we have done here is;
     * 1. made a variable for the ref.current
     * 2. set variable for the scrolled distance
     *  -- if the view is scrolled 200px down, scrollTop == 200
     * 3. set variable maxScrollTop to be the total scroll height - the client height.
     *  -- ie, the max ammount that the client can be scrolled (4000 scroll - 200 client == 3800 potential scroll)
     * 4. set variable InvertedScrollTop to the max possible scroll value minus how much is actually scrolled
     *  -- ie, if scrolled 200 of 4000, we get 3800 - 200 == 3600 from the bottom
     *  -- furthermore, if we are scrolled to 3800 of the 4000 window, 
     *    then the location of the scroll will be 3800 - 3800, giving us the bottom up location of 0
     */
  
    setScrollPosition(invertedScrollTop);
  }  

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  // !!! I need to find out what is going on with chatRef and messagesEndRef and why - I would like to simplify it as just one of possible !!! //

  return (
    <div className='chat-window d-flex flex-column p-2 gap-2 h-100 bg-layer-1 rounded border border-primary'>
        
      <div className='message-area d-flex flex-column rounded flex-fill border border-warning'>
        <div className='message-container smooth-scroll flex-fill border border-danger' ref={chatRef} onScroll={onScroll}> 
          
        {messages && messages.map((msg, index) => {
          // return <ChatMessage key={msg.id} message={msg} />;
          const key = msg.id || `message-${index}`;
          // console.log(`Key for message ${index}: ${msg.id} /or/ ${key}`);
          return <ChatMessage key={key} message={msg} />;
        })}

          {<ExampleElements numElements={20} />}
          
          <div ref={messagesEndRef} />
        </div>

        {scrollPosition >= 50 && (
          <button className='scroll-button rounded' onClick={scrollToBottom}>
            {/* Scroll to bottom */}
            {/* {scrollPosition} */}
            <FontAwesomeIcon icon="fa-solid fa-angles-down" />
          </button>
        )}

      </div>

      <Form>
        <Form.Group controlId="form-group-id" className='d-flex'>

          <Form.Control
            className='me-2'
            value={formValue}
            type="text"
            placeholder="Enter your message"
            onChange={(e) => {
              setFormValue(e.target.value);
              // console.log("form changed " + formValue);
            }}
          />

          <Button className='send-button' type="submit" disabled={!formValue}>
            <FontAwesomeIcon icon="fa-solid fa-paper-plane" />
          </Button>
        </Form.Group>
      </Form>
      
    </div>
  )
}
  
export default ChatWindow;


// {messages && messages.map((msg, index) => {
//   console.log(`Key for message ${index}: ${msg.id}`);
//   return <ChatMessage key={msg.id} message={msg} />;
//  })}
 