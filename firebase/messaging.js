import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db, userAuth } from "@/firebase/base";

const messageDataDestructure = (data) => {
    let messageList =[];
    data.forEach(doc=>{
        let message = doc.data()
        message.id = doc.id;
        messageList.push(message);
    })
    messageList.sort((a, b) => (a.createdAt > b.createdAt) ? 1 : (b.createdAt > a.createdAt) ? -1 : 0);
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
                canon: false
            })},
        getMessages:
            async (gameId) => {
                const initChatDoc = collection(db, `game`, gameId, `initChat`)
                let data = await getDocs(initChatDoc);
                return messageDataDestructure(data,true)
            }
    },
    casual: {
        addMessage: async (gameId, message) => {
            const casualChatDoc = doc(collection(db, `game`, gameId, `casualChat`))
            await setDoc(casualChatDoc, {
                text: message,
                uid: userAuth.currentUser.uid,
                createdAt: Date.now()
            })},
        getMessages:
            async (gameId) => {
                const casualChatDoc = collection(db, `game`, gameId, `casualChat`)
                let data = await getDocs(casualChatDoc);
                return messageDataDestructure(data)
            }
    }
}