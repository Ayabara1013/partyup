import {
  addDoc, deleteDoc, getDoc, getDocs, setDoc, updateDoc,
  collection, doc,
  Timestamp,
} from "firebase/firestore";
import {db, reconstructDoc, toArray, userAuth} from "@/javascript/firebase/base";
import toast from "react-hot-toast";

export const fbGmManager = {
  general: {
    createGame: async (data) => {
      //data fields: name, gm, system, playerCount, sc0, sc1, sc2, sc3, tags, isPublic, desc
      //Create Game Entry in Database
      //Reference is the collection. Let firebase create the gid using addDoc later.
      const gamePrivateRef = collection(db, `game`);

      data.createdAt = Timestamp.now();
      data.status = 'recruiting';
      data.completionResult = 'none';
      data.reqInitPermission = true;
      data.players = [];
      data.joinRequests = [];

      let gamePrivateDoc = await addDoc(gamePrivateRef, data);
      return !!gamePrivateDoc;
    },
    updateGame: async function (data, gid) {
      //data fields: name, uName, system, playerCount, sc0, sc1, sc2, sc3, tags, isPublic
      //Create Game Entry in Database
      //Reference is the collection. Let firebase create the gid using addDoc later.
      const gamePrivateRef = doc(db, `game`, gid);

      return await updateDoc(gamePrivateRef, data)
        .then(() => {
          return true
        }).catch(() => {
          return false
        });
    },
    startGame: async function (gid) {
      const gamePrivateRef = doc(db, `game`, gid);
      return await updateDoc(gamePrivateRef, {status: 'started'})
        .then(() => {
          return true
        }).catch(() => {
          return false
        });
    },
    getGame: async function (gid) {
      let tempGame = reconstructDoc(await getDoc(doc(db, `game`, gid)));
      tempGame.inviteCode = toArray(await getDocs(collection(db, `game`, gid, 'invites')))[0].id;
      return tempGame;
    },
    getGames: async function (uid) {
      const gamePrivateListRef = doc(db, `user`, uid);
      let gidList = reconstructDoc(await getDoc(gamePrivateListRef)).gmGames;
      const games = [];
      for (let gid of gidList) {
        let tempGame = await this.getGame(gid)
        games.push(tempGame);
      }
      return games;
    },
    acceptJoinRequest: async (gid, user) => {
      let playerRef = doc(db, `game`, gid, `players`, user.id);
      let requestRef = doc(db, `game`, gid, `joinRequests`, user.id);
      let addResult = await setDoc(playerRef, {uName: user.uName})
        .then(() => {
          return true
        }).catch(() => {
          return false
        });
      let removeResult = await deleteDoc(requestRef)
        .then(() => {
          return true
        }).catch(() => {
          return false
        });
      return addResult && removeResult
    }
  },
  inGame: {
    chat: {
      addMessage: async (game, windows, content) => {
        const gameChatRef = collection(db, `game`, game.id, `messages`)
        await addDoc(gameChatRef, {
          uid: userAuth.currentUser.uid,
          content,
          windows,
        }).catch((e) => {
          console.log(e)
          toast.error('Something went wrong, please try again later.')
        })
      },
    }
  },
  live: {}
}