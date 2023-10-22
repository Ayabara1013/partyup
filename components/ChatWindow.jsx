// components/ScrollableBox.js
import { useState } from 'react';

export function ExampleElements({ numElements = 100 }) {
  const elements = [];

  function ExampleChatMessage({ num }) {
    const senderClass = () => {
      if (num % 2 === 0) return 'sent';
      else return 'recieved';
    }

    return (
      <div className={ `example-message-element ${ senderClass() }` }>
        {/* <FontAwesomeIcon icon="fa-solid fa-user" /> */ }
        <div className='example-message-text'>Element { num }</div>
      </div>
    )
  }

  for (let i = 0; i < numElements; i++) {
    elements.push(<ExampleChatMessage key={ i } num={ i }/>)
  }

  elements.push(
    <div key={ numElements } className='example-message-element sent'>
      {/* <FontAwesomeIcon icon="fa-solid fa-user" /> */ }
      <div className='example-message-text'>wee Special Element! also, { numElements }</div>
    </div>
  );


  return (
    <>
      { elements }
      <div className='example-message-element'>warning</div>
      <div className='example-message-element recieved'>recieved</div>
      <div className='example-message-element sent'>sent</div>
    </>
  )
}

function generateMessages(count) {
  let messages = [];
  for (let i = 0; i < count; i++) {
    let cl = i % 2 ? 'sent' : 'received';
    messages.push(<div className={ cl }>message { i }</div>);
  }
  return messages;
}

// function ChatWindow(props) {
//   return (
//     <div className='box w-1/2 overflow-x-hidden'
//       style={{
//         position: "relative",
//         height: "100%",
//         'overflow-y': "scroll"
//        }}
//     >
//       <div
//         style={{
//           position: "relative"
//         }}
//       >
//         {/* {children} */}
//         <ExampleElements numElements={20}/>
//       </div>
//     </div>
//   )
// }

const ScrollableBox = () => {
  const [ count, setCount ] = useState(1);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div className="w-full h-64 border rounded-lg overflow-hidden">
      <div className="h-full overflow-y-scroll p-4">
        { Array.from({ length: count }).map((_, index) => (
          <div key={ index } className="border-b p-2">
            Item { index + 1 }
          </div>
        )) }
      </div>
      <button
        className="w-full p-2 bg-blue-500 text-white"
        onClick={ handleIncrement }
      >
        Add Item
      </button>
    </div>
  );
};

export default ScrollableBox;
