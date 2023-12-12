import moment from "moment/moment";

import MessageContextMenu from "@/app/game/[gameId]/_ContextMenus/MessageContextMenu";

import { useApplicationContext } from "@/app/ApplicationContext";
import { userAuth } from "@/firebase/base";

export default function ChatMessage({ game, message, members }) {
  const { setContextMenu } = useApplicationContext();
  const { text, uid, type, canon } = message;

  const baseChatClass = (uid === userAuth.currentUser.uid) ? 'chat-end' : 'chat-start';

  let name = (members) ? members[uid] : uid;
  let avatar = <img src={(type.includes('icon')) && 'some image source'} alt=""/>
  let messageTimeText = moment(message.createdAt).calendar();
  let messageClass = (canon) && `chat-bubble-info`;

  const disableContextMenu = (e) => {
    e.preventDefault();
    let x = e.clientX, y = e.clientY, right = (e.clientX + 200 > window.innerWidth);
    right && (x = window.innerWidth - x);
    let style = {
      top: `${y}px`,
      ...right && { right: `${x}px` },
      ...!right && { left: `${x}px` }
    }

    let menuOptions = <MessageContextMenu message={message} game={game}/>

    setContextMenu({ style, menuOptions, clicked: true });
  }

  return (
    <div className={`chat ${baseChatClass}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          {/*<img src={(type.includes('icon'))?'some image source':''} alt=""/>*/}
          <img alt=""/>
        </div>
      </div>
      <div className="chat-header opacity-50">
        {type.includes('header') && name}
      </div>
      <div className={`chat-bubble ${messageClass}`} onContextMenu={disableContextMenu}>
        <div className="tooltip tooltip-bottom text-left" data-tip={messageTimeText}>
          {text}
        </div>
      </div>
    </div>

  )
}