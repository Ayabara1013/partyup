'use client';
import { useApplicationContext } from "@/app/ApplicationContext";
import { accountLocalStorage, messageLocalStorage } from "@/javascript/localStorage";
import { useRouter } from "next/navigation";
import { addArrayToArray, sortByKey } from "@/javascript/functions";
import { useEffect, useState } from "react";
import ChatWindow from "./_ChatWindow/chatWindow";
import { fbManagement } from "@/javascript/firebase/fbManagement";
import { userAuth } from "@/javascript/firebase/base";
import { messaging } from "@/javascript/firebase/messaging";
import { ui } from "@/javascript/ui";

export default function Play() {
  const { push } = useRouter();
  let { user, activeGames } = useApplicationContext();
  const [ game, setGame ] = useState(null);
  const [ gameId, setGameId ] = useState(null);
  const [ members, setMembers ] = useState(null);
  const [ messages, setMessages ] = useState(null);

  useEffect(() => {
    (user) && setGameId(accountLocalStorage.getCurrentGame());
  }, [ user ]);

  useEffect(() => {
    if (activeGames) {
      if (!gameId) {
        push('/my-games');
      } else {
        let games = [];
        addArrayToArray(games, activeGames.playerGames, 'id');
        addArrayToArray(games, activeGames.dmGames, 'id');
        for (let game of games) {
          if (game.id === gameId) {
            setItems();
            messaging.game.liveMessages(gameId, liveGameMessageUpdate).then();
            return;
          }
        }
        push('/');
      }
    }
  }, [ activeGames ]);

  useEffect(() => {
    let windows = [ 'rolls', 'canon', 'init', 'open' ];
    for (let window of windows) {
      (ui.messaging[window].element()) && ui.messaging[window].element().scrollIntoView({ behavior: 'smooth' });
    }
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

  return (game &&
    <div className='home-page w-full h-full border'>
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