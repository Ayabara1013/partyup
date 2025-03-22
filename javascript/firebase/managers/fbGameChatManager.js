import {addDoc, collection, getDocs, onSnapshot, query, Timestamp, where} from "firebase/firestore";
import {db, toArray, userAuth} from "@/javascript/firebase/base";
import toast from "react-hot-toast";
import {lsGameMessages} from "@/javascript/util/localStorage";

export const fbGameChatManager = {
  live: {
    messages: async (gameId, setMessages) => {
      const messageRef = collection(db, `game`, gameId, `messages`);
      const q = query(messageRef, where('updatedAt', '>=', Timestamp.now()));
      return onSnapshot(q, (snapshot) => {
        setMessages(toArray(snapshot));
      })
    }
  },
  get: {
    getAllMessages:
      async (gid) => {
        return toArray(await getDocs(collection(db, `game`, gid, `messages`)).catch(e => {
          toast.error('Something went wrong getting all messages, please try again later.')
          return [];
        }));
      },
    getUpdatedMessages:
      async (gid) => {
        const q = query(collection(db, `game`, gid, `messages`),
          where('updatedAt', '>=', lsGameMessages.getChatLogPrevAccessTime() - 2000));
        return toArray(await getDocs(q).catch(e => {
          toast.error('Something went wrong getting newer messages, please try again later.')
          return [];
        }));
      },
  },
  add: {
    message: async function (window, gid, text) {
      let data = {
        text,
        uid: userAuth.currentUser.uid,
        canon: false, turn: false, open: false
      }
      data[window] = true;
      await addDoc(collection(db, `game`, gid, `messages`), data)
    }
  }
}