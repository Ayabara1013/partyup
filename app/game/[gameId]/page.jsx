'use client'

import moment from "moment";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import DmMessageOptions from "@/components/ContextMenu/DmMessageOptions";
import PlayerMessageOptions from "@/components/ContextMenu/PlayerMessageOptions";

import { addArrayToArray, sortByKey } from "@/util/functions";

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { messaging } from "@/firebase/messaging";
import { fbManagement } from "@/firebase/fbManagement";
import { useApplicationContext } from "@/app/ApplicationContext";
import { messageLocalStorage } from "@/util/localStorage";
import ChatWindow from "@/app/game/[gameId]/_ChatWindow";

export default function Page({ params }) {

  const { push } = useRouter();

  let { gameId } = params;
  const { activeGames } = useApplicationContext();

  const [ game, setGame ] = useState(null);
  const [ members, setMembers ] = useState(null);
  const [ messages, setMessages ] = useState(null);

  useEffect(() => {
    if (activeGames) {
      let games = [];
      addArrayToArray(games, activeGames.playerGames, 'id');
      addArrayToArray(games, activeGames.dmGames, 'id');
      console.log(games, gameId);
      for (let game of games) {
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
  }, [ messages ]);

  const setItems = async () => {
    //Get game info
    let game = await fbManagement.get.singleGame(gameId);
    let tempList = {};

    //Add all members to list for quick message lookup
    for (let member of game.members) {
      tempList[member.id] = (member.id !== userAuth.currentUser.uid) ? `${member.uName} (Player)` : 'You';
    }
    //Add DM to list
    tempList[game.uid] = (game.uid === userAuth.currentUser.uid) ? 'You' : `${game.uName} (DM)`;

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
    <div className="h-full w-full gap-4 routePage">
      <div className="h-3/4 w-full border chat-container px-4">
        <ChatWindow window="rolls" gameItems={{ game, messages, members }}/>
        <ChatWindow window="canon" gameItems={{ game, messages, members }}/>
        <ChatWindow window="init" gameItems={{ game, messages, members }}/>
        <ChatWindow window="open" gameItems={{ game, messages, members }}/>
      </div>
      <div className="h-1/4 w-full border gap-4 flex px-4">
      </div>
    </div>
  )
}
