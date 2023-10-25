import { addDoc, collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";

import { sortByKey } from "@/util/functions";

import { db, toArray, userAuth } from "@/firebase/base";

export const messaging = {
  game: {
    addMessage:
      async (game, window, text, tags) => {
        const gameChatRef = collection(db, `game`, game.id, `messages`)
        await addDoc(gameChatRef, {
          text, window, tags,

          createdAt: Date.now(),
          lastEditAt: Date.now(),
          uid: userAuth.currentUser.uid,

          chapter: game.currentChapter,
          act: game.currentAct,
          canon: false,
        })
      },
    getMessages:
      async (gameId) => {
        const messageRef = collection(db, `game`, gameId, `messages`);

        return toArray(await getDocs(messageRef));
      },
    getUpdateMessage:
      async (gameId, lastUpdate) => {
        const messageRef = collection(db, `game`, gameId, `messages`);
        const q = query(messageRef,
          where('lastEditAt', '>=', lastUpdate - 2000));

        return toArray(await getDocs(q));
      },
    liveMessages:
      async (gameId, callback) => {
        const messageRef = collection(db, `game`, gameId, `messages`);
        const q = query(messageRef,
          where('lastEditAt', '>=', Date.now() - 1000));
        return onSnapshot(q, (snapshot) => {
          callback(toArray(snapshot));
        })
      },
    addCanon:
      async (gameId, messageId) => {
        const messageRef = doc(db, `game`, gameId, `messages`, messageId);
        await updateDoc(messageRef, {
          lastEditAt: Date.now(),
          canon: true
        })
      },
    removeCanon:
      async (gameId, messageId) => {
        const messageRef = doc(db, `game`, gameId, `messages`, messageId);
        await updateDoc(messageRef, {
          lastEditAt: Date.now(),
          canon: false
        })
      },
  },
  dm: {}
}