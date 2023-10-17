'use client'

import moment from "moment";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";


import ContextMenuBase from "@/components/ContextMenu/ContextMenuBase";
import DmMessageOptions from "@/components/ContextMenu/DmMessageOptions";
import PlayerMessageOptions from "@/components/ContextMenu/PlayerMessageOptions";

import { addArrayToArray, sortByKey } from "@/util/functions";

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { messaging } from "@/firebase/messaging";
import { fbManagement } from "@/firebase/fbManagement";
import { ApplicationContext } from "@/app/ApplicationContext";
import { messageLocalStorage } from "@/util/localStorage";

export default function Page({ params }) {

  const { push } = useRouter();

  const { activeGames, displayPage } = useContext(ApplicationContext);

  const [ game, setGame ] = useState(null);
  const [ isDm, setIsDm ] = useState(false);
  const [ members, setMembers ] = useState(null);
  const [ clicked, setClicked ] = useState(false);
  const [ messages, setMessages ] = useState(null);
  const [ contextMenu, setContextMenu ] = useState(null);


  useEffect(() => {
    const handleClick = () => {
      setClicked(false);
    }
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    }
  }, [])

  let { gameId } = params;

  useEffect(() => {
    if (activeGames) {
      for (let game of activeGames.dmGames) {
        if (game.id === gameId) {
          setIsDm(true);
          setItems();
          messaging.game.liveMessages(gameId, liveGameMessageUpdate).then();
          return;
        }
      }
      for (let game of activeGames.playerGames) {
        if (game.id === gameId) {
          setItems();
          messaging.game.liveMessages(gameId, liveGameMessageUpdate).then();
          return;
        }
      }
      push('/home');
    }
  }, [ activeGames ]);

  useEffect(() => {
    ui.messaging.canon.element().scrollIntoView({ behavior: 'smooth' });
    ui.messaging.open.element().scrollIntoView({ behavior: 'smooth' });
    ui.messaging.init.element().scrollIntoView({ behavior: 'smooth' });
    displayPage(true);
  }, [ messages ]);

  const setItems = async () => {
    //Get game info
    let game = await fbManagement.get.singleGame(gameId);
    let tempList = {};

    //Add all members to list for quick message lookup
    for (let member of game.members) {
      tempList[member.id] = (member.id !== userAuth.currentUser.uid) ? `${ member.uName } (Player)` : 'You';
    }
    //Add DM to list
    tempList[game.uid] = (game.uid === userAuth.currentUser.uid) ? 'You' : `${ game.uName } (DM)`;

    //Get messages from local storage
    let messages = messageLocalStorage.game.get(gameId);

    //Get messages from server if local storage is empty or if there are new messages (saves on reads)
    if (messages.length > 0) {
      let lastTime = messageLocalStorage.game.getAccessTime(gameId);
      let tempMessages = await messaging.game.getUpdateMessage(gameId, lastTime);
      addArrayToArray(messages, tempMessages, 'id');
    } else {
      messages = await messaging.game.getMessages(gameId);
    }

    sortByKey(messages, 'createdAt');

    //Save messages to local storage and state
    messageLocalStorage.game.set(gameId, messages);
    setGame(game);
    setMembers(tempList);
    setMessages(messages);
  }

  //Live update of new init messages
  const liveGameMessageUpdate = async (messages) => {
    let localMessages = messageLocalStorage.game.get(gameId);
    addArrayToArray(localMessages, messages, 'id');
    sortByKey(localMessages, 'createdAt');
    messageLocalStorage.game.set(gameId, localMessages);
    setMessages(localMessages);
  }

  return (
    <div className="h-full w-full gap-4 routePage hidden">
      <div className="h-3/4 w-full border gap-4 flex px-4">
        <div className="w-1/6 border">
          Some Rolling Stuff
        </div>
        <ChatWindow window="canon" gameItems={ { game, messages, members, setClicked, setContextMenu } }/>
        <ChatWindow window="init" gameItems={ { game, messages, members, setClicked, setContextMenu } }/>
        <ChatWindow window="open" gameItems={ { game, messages, members, setClicked, setContextMenu } }/>
      </div>
      <div className="h-1/4 w-full border gap-4 flex px-4">

      </div>
      { clicked && (
        <ContextMenuBase style={ contextMenu.style }>
          <PlayerMessageOptions message={ contextMenu.message }/>
          { (isDm && contextMenu.message.canon !== undefined) &&
            <DmMessageOptions message={ contextMenu.message } gameId={ gameId }/> }
        </ContextMenuBase>
      ) }
    </div>
  )
}

function ChatWindow({ window, gameItems }) {
  let { game, messages, members, setClicked, setContextMenu } = gameItems
  let canon = (window === 'canon');
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
    let setFunc = { context: setContextMenu, clicked: setClicked }
    return finalChat.map(msg => <ChatMessage key={ `${ window }-${ msg.id }` } message={ msg } members={ members }
                                             setFunc={ setFunc }/>);
  }
  const filterMessages = () => {
    let newMessageList = [];
    if (messages) {
      for (let msg of messages) {
        (msg.window === window) && newMessageList.push(structuredClone(msg));
        if(window === 'canon'){
          (msg.window === 'init' && msg.canon === true) && newMessageList.push(structuredClone(msg));
        }
      }
      sortByKey(newMessageList, 'createdAt');

      return newMessageList;
    }

    return <></>
  }

  const textOnKeyUp = async (e) => {
    if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey) {
      await messaging.game.addMessage(game, window, e.target.value.trim(), []);
      e.target.value = '';
    }
  }
  return (
    <div className="w-1/3 border flex flex-col">
      <div className={ `chat-box ${ (canon) && 'h-full' }` }>
        { generateMessages() }
        <span id={ ui.messaging[window].id }/>
      </div>
      { !canon && <textarea className="w-full flex-1" onKeyUp={ textOnKeyUp }/> }
    </div>
  )
}

function ChatMessage({ message, members, setFunc }) {
  const { text, uid, type, canon } = message;

  const baseChatClass = (uid === userAuth.currentUser.uid) ? 'chat-end' : 'chat-start';

  let name = (members) ? members[uid] : uid;
  let avatar = <img src={ (type.includes('icon')) && 'some image source' } alt=""/>
  let messageTimeText = moment(message.createdAt).calendar();
  let messageClass = (canon) && `chat-bubble-info`;


  const disableContextMenu = (e) => {
    e.preventDefault();
    let x = e.clientX, y = e.clientY, right = (e.clientX + 200 > window.innerWidth);
    right && (x = window.innerWidth - x);
    let style = {
      top: `${ y }px`,
      ...right && { right: `${ x }px` },
      ...!right && { left: `${ x }px` }
    }

    setFunc.context({ style, message });
    setFunc.clicked(true);
  }

  return (
    <div className={ `chat ${ baseChatClass }` }>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          {/*<img src={(type.includes('icon'))?'some image source':''} alt=""/>*/ }
          <img alt=""/>
        </div>
      </div>
      <div className="chat-header opacity-50">
        { type.includes('header') && name }
      </div>
      <div className={ `chat-bubble ${ messageClass }` } onContextMenu={ disableContextMenu }>
        <div className="tooltip tooltip-bottom text-left" data-tip={ messageTimeText }>
          { text }
        </div>
      </div>
    </div>

  )
}