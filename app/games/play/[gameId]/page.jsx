'use client';

import {ChatWindow} from '@app/games/play/[gameId]/(components)/chatWindow'
import '@styles/play/play.scss'
import {use, useEffect, useRef, useState} from "react";
import {useAccountManager} from "@app/(contexts)/accountManager";
import {dirHref} from "@/javascript/assets/directoryHref";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {fbGameChatManager} from "@/javascript/firebase/managers/fbGameChatManager";
import {lsGameMessages} from "@/javascript/util/localStorage";
import msgArrayManip from "@/javascript/util/msgArrayManip";

export default function Play({params}) {
  const {push} = useRouter();
  const {gameId: gid} = use(params);
  const {user, gmGames, playerGames, loading} = useAccountManager();

  const [messages, setMessages] = useState([]);
  const [gameObject, setGameObject] = useState(null);
  const messageUnsub = useRef(null);
  const chatWindowProps = {messages, game: gameObject, uid: user?.uid}

  useEffect(() => {
    if (isPartOfGame(gmGames)) return;
    if (isPartOfGame(playerGames)) return;
    if (!user && !loading) {
      toast.error("Please login and try again.");
      setTimeout(() => {
        push(dirHref.user.signin)
      }, 1000)
    }
    if (gmGames && playerGames) {
      toast.error(`You are neither the GM nor a player of this game. Redirecting to your games.`);
      setTimeout(() => {
        push(dirHref.games.root)
      }, 1000)
    }
  }, [gmGames, playerGames, user, loading])

  function isPartOfGame(gameList) {
    if (gameList) {
      for (let game of gameList) {
        if (gid === game.id) {
          if (messages.length === 0) loadMessages().then()
          if (!gameObject) setGameObject(game);
          return true;
        }
      }
    }
    return false;
  }

  async function loadMessages() {
    let tempMessages = lsGameMessages.getChatLog(gid);
    if (tempMessages && tempMessages.length > 0) {
      let newMessages = await fbGameChatManager.get.getUpdatedMessages(gid);
      msgArrayManip.combineReplaceOnKey(tempMessages, newMessages, `id`);
      console.log(`grabbed new`)
    } else {
      tempMessages = await fbGameChatManager.get.getAllMessages(gid);
      console.log(`grabbed local`)
    }
    msgArrayManip.sortByCreated(tempMessages);
    lsGameMessages.setChatLog(gid, tempMessages);
    setMessages(tempMessages);

    await fbGameChatManager.live.messages(gid, updateMessages)
  }

  async function updateMessages(newMessages) {
    console.log(`received message`)
    let tempMessages = [...lsGameMessages.getChatLog(gid)]
    msgArrayManip.combineReplaceOnKey(tempMessages, newMessages, `id`);
    msgArrayManip.sortByCreated(tempMessages);
    lsGameMessages.setChatLog(gid, tempMessages);
    setMessages(tempMessages);
  }

  return (
    <div className={`play-page h-full`}>
      <div className='chat-row flex p-2 gap-2'>
        <ChatWindow {...chatWindowProps} name={'canon'}/>
        <ChatWindow {...chatWindowProps} name={'turn'}/>
        <ChatWindow {...chatWindowProps} name={'open'}/>
      </div>

      <div className='tool-row flex p-2 gap-4'>
        <div className='tool-row__element'>tools</div>
        <div className='tool-row__element '>tracker</div>
      </div>

    </div>
  )
}