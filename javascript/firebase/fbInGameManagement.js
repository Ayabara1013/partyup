import toast from "react-hot-toast";
import { addDoc, collection, doc, getDocs, onSnapshot, query, updateDoc, where, or, getDoc } from "firebase/firestore";

import { db, reconstructDoc, toArray, userAuth } from "@/javascript/firebase/base";

export const fbInGameManagement = {
  message: {
    player: {
      addMessage:
        async (game, window, text, tags) => {
          const gameChatRef = collection(db, `game`, game.id, `messages`)
          try {
            await addDoc(gameChatRef, {
              text, window, tags,

              createdAt: Date.now(),
              lastEditAt: Date.now(),
              uid: userAuth.currentUser.uid,

              chapter: game.currentChapter,
              act: game.currentAct,
              canon: false,
            })
          } catch (e) {
            console.log(e)
            toast.error('Something went wrong, please try again later.')
          }
        },
      getMessages:
        async (gameId) => {
          try {
            const messageRef = collection(db, `game`, gameId, `messages`);

            return toArray(await getDocs(messageRef));
          } catch (e) {
            console.log(e)
            toast.error('Something went wrong, please try again later.')
            return [];
          }
        },
      getUpdateMessage:
        async (gameId, lastUpdate) => {
          try {
            const messageRef = collection(db, `game`, gameId, `messages`);
            const q = query(messageRef,
              where('lastEditAt', '>=', lastUpdate - 2000));

            return toArray(await getDocs(q));
          } catch (e) {
            console.log(e)
            toast.error('Something went wrong, please try again later.')
            return [];
          }
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
      livePermissionUpdate:
        async (gameId, callback) => {
          const permissionRef = collection(db, `game`, gameId, `initChatPermissions`);
          const q = query(permissionRef,
            where('lastEditAt', '>=', Date.now() - 1000),
            or(
              where('__name__', '==', `${userAuth.currentUser.uid}-permission`),
              where('__name__', '==', `${userAuth.currentUser.uid}-mute`)
            ));


          return onSnapshot(q, (snapshot) => {
            let { initAllow, initCommands, initMuted, muteExpiryTime, } = reconstructDoc(snapshot[0]);
            callback({
              initAllow: initAllow || false,
              initCommands: initCommands || [ 'roll' ],
              initMuted: initMuted || false,
              muteExpiryTime: muteExpiryTime || 0,
            });
          })
        },
    },
    dm: {
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
  }
}