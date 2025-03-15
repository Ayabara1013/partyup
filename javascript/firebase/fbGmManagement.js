import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc, Timestamp, updateDoc} from "firebase/firestore";
import {db, reconstructDoc, toArray, userAuth} from "@/javascript/firebase/base";
import toast from "react-hot-toast";


export const fbGmManagement = {
  general: {
    createGame: async (data) => {
      //data fields: name, uName, system, playerCount, sc0, sc1, sc2, sc3, tags, isPublic
      //Create Game Entry in Database
      //Reference is the collection. Let firebase create the gameId using addDoc later.
      const gamePrivateRef = collection(db, `game`);

      data.createdAt = Timestamp.now();
      data.status = 'recruiting';
      data.completionResult = 'none';
      data.reqInitPermission = true;
      data.members = [];

      let gamePrivateDoc = await addDoc(gamePrivateRef, data);
      return !!gamePrivateDoc;
    },
    updateGame: async (data, gameId) => {
      //data fields: name, uName, system, playerCount, sc0, sc1, sc2, sc3, tags, isPublic
      //Create Game Entry in Database
      //Reference is the collection. Let firebase create the gameId using addDoc later.
      const gamePrivateRef = doc(db, `game`, gameId);

      return await updateDoc(gamePrivateRef, data)
        .then(() => {
          return true
        }).catch(() => {
          return false
        });
    },
    startGame: async (gameId) => {
      const gamePrivateRef = doc(db, `game`, gameId);
      return await updateDoc(gamePrivateRef, {
        status: 'started'
      })
        .then(() => {
          return true
        }).catch(() => {
          return false
        });
    },
    getGames: async (uid) => {
      const gamePrivateListRef = doc(db, `user`, uid);
      let gameIdList = reconstructDoc(await getDoc(gamePrivateListRef)).gmGames;
      const games = [];
      for (let gameId of gameIdList) {
        const gameRef = doc(db, `game`, gameId);
        let tempGame = reconstructDoc(await getDoc(gameRef));
        let memberListRef = collection(db, `game`, gameId, 'members');
        let invitesRef = collection(db, `game`, gameId, 'invites');
        let requestsRef = collection(db, `game`, gameId, 'joinRequest');
        let requestUsers = [];
        for (let req of toArray(await getDocs(requestsRef))) {
          let requestUser = await getDoc(doc(db, `user`, req.id));
          requestUsers.push(reconstructDoc(requestUser));
        }
        tempGame.members = toArray(await getDocs(memberListRef));
        tempGame.inviteCode = toArray(await getDocs(invitesRef))[0].id;
        tempGame.requests = requestUsers
        games.push(tempGame);
      }
      return games;
    },
    acceptJoinRequest: async (gameId, user) => {
      let memberRef = doc(db, `game`, gameId, `members`, user.id);
      let requestRef = doc(db, `game`, gameId, `joinRequest`, user.id);
      await setDoc(memberRef, {user: user.uName});
      toast(`Added member ${user.uName}`)
      await deleteDoc(requestRef);
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
  }
}