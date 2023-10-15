import { collection, doc, getDocs, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";

import { sortByKey } from "@/util/functions";

import { db, userAuth } from "@/firebase/base";

const messageDataDestructure = (data) => {
  let messageList = [];
  data.forEach(doc => {
    let message = doc.data();
    message.id = doc.id;
    messageList.push(message);
  })
  sortByKey(messageList, 'createdAt');
  sortByKey(messageList, 'createdAt');
  return messageList;
}

export const messaging = {
  init: {
    addMessage: async (gameId, message) => {
      const initChatDoc = doc(collection(db, `game`, gameId, `initChat`))
      await setDoc(initChatDoc, {
        text: message,
        uid: userAuth.currentUser.uid,
        createdAt: Date.now(),
        lastEditAt: Date.now(),
        canon: false
      })
    },
    getMessages:
      async (gameId) => {
        const initChatDoc = collection(db, `game`, gameId, `initChat`);

        return messageDataDestructure(await getDocs(initChatDoc));
      },
    getUpdateMessage:
      async (gameId, lastUpdate) => {
        const initChatRef = collection(db, `game`, gameId, `initChat`);
        const q = query(initChatRef,
          where('lastEditAt', '>=', lastUpdate - 2000));
        return messageDataDestructure(await getDocs(q));
      },
    liveMessages:
      async (gameId, callback) => {
        const initChatRef = collection(db, `game`, gameId, `initChat`);
        const q = query(initChatRef,
          where('lastEditAt', '>=', Date.now() - 2000));
        return onSnapshot(q, (snapshot) => {
          callback(messageDataDestructure(snapshot));
        })
      }
    ,
    addCanon:
      async (gameId, messageId) => {
        const initChatDoc = doc(db, `game`, gameId, `initChat`, messageId);
        await updateDoc(initChatDoc, {
          lastEditAt: Date.now(),
          canon: true
        })
      },
    removeCanon:
      async (gameId, messageId) => {
        const initChatDoc = doc(db, `game`, gameId, `initChat`, messageId);
        await updateDoc(initChatDoc, {
          lastEditAt: Date.now(),
          canon: false
        })
      },
  },
  casual: {
    addMessage: async (gameId, message) => {
      const casualChatDoc = doc(collection(db, `game`, gameId, `casualChat`))
      await setDoc(casualChatDoc, {
        text: message,
        uid: userAuth.currentUser.uid,
        createdAt: Date.now()
      })
    },
    getMessages:
      async (gameId) => {
        const casualChatDoc = collection(db, `game`, gameId, `casualChat`)
        let data = await getDocs(casualChatDoc);
        return messageDataDestructure(data);
      },
    getUpdateMessage:
      async (gameId, lastUpdate) => {
        const initChatRef = collection(db, `game`, gameId, `casualChat`);
        const q = query(
          initChatRef,
          where('createdAt', '>=', lastUpdate - 2000));
        return messageDataDestructure(await getDocs(q));
      },
    liveMessages:
      async (gameId, callback) => {
        const initChatRef = collection(db, `game`, gameId, `casualChat`);
        const q = query(
          initChatRef,
          where('createdAt', '>=', Date.now() - 2000));
        onSnapshot(q, (snapshot) => {
          callback(messageDataDestructure(snapshot));
        })
      }
  }
}