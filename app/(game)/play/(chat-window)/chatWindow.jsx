import { sortByKey } from "@/javascript/functions";

import { ui } from "@/javascript/ui";
import ChatMessage from "@/app/(game)/play/(chat-window)/(chatMessage)/chatMessage";
import ChatInput from "@/app/(game)/play/(chat-window)/(chatInput)/chatInput";

export default function ChatWindow({ window, gameItems }) {
  let { game, messages, members } = gameItems
  let noInput = (window === 'canon' || window === 'rolls');
  const generateMessages = (preFilterMessages) => {
    let messages = filterMessages(preFilterMessages);
    let finalChat = [];
    for (let i = 0; i < messages.length; i++) {
      let msg = messages[i];
      msg.type = [];
      //check if last consecutive msg by a player to display name, also will do for first msg in the log.
      if (i !== 0) {
        let prevMsg = messages[i - 1];
        if (prevMsg.uid !== msg.uid) {
          msg.type.push('header');
        }
      } else {
        msg.type.push('header');
      }
      if (i === messages.length - 1) {
        msg.type.push('icon');
        finalChat.push(msg);
        break;
      }
      //check if last consecutive msg by a player to display icon.
      let nextMsg = messages[i + 1];
      if (nextMsg.uid !== msg.uid) {
        msg.type.push('icon');
      }
      finalChat.push(msg);
    }
    return finalChat.map(msg =>
      <ChatMessage key={`${window}-${msg.id}`} game={game} message={msg} members={members}/>);
  }
  const filterMessages = () => {
    let newMessageList = [];
    if (messages) {
      for (let msg of messages) {
        (msg.window === window) && newMessageList.push(structuredClone(msg));
        switch (window) {
          case 'canon':
            (msg.window === 'init' && msg.canon === true) && newMessageList.push(structuredClone(msg));
            break;
          case 'rolls':
            (msg.tags.includes('roll') && msg.uid === 'system') && newMessageList.push(structuredClone(msg));
            break;
        }
        if (window === 'canon') {
        }
      }
      sortByKey(newMessageList, 'createdAt');

      return newMessageList;
    }

    return <></>
  }

  return (
    <div className="border flex flex-col">
      <div className={`chat-box ${(noInput) && 'h-full'}`}>
        {generateMessages()}
        <span id={ui.messaging[window].id}/>
      </div>
      {(!noInput) && <ChatInput id={window} game={game} window={window}/>}
    </div>
  )
}