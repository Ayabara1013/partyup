import {addDoc, collection, getDocs, onSnapshot, query, Timestamp, where} from "firebase/firestore";
import {db, toArray, userAuth} from "@/javascript/firebase/base";
import toast from "react-hot-toast";

export const fbGameChatManager = {
  live: {
    messages: async (gameId, fromTime, setMessages) => {
      const messageRef = collection(db, `game`, gameId, `messages`);
      const q = query(messageRef, where('updatedAt', '>=', fromTime));
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