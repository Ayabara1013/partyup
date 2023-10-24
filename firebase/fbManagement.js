// noinspection JSCheckFunctionSignatures
import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where
} from "firebase/firestore";

import { db, reconstructDoc, toArray, userAuth } from "@/firebase/base";
import { toastUser } from "@/util/functions";
import toast from "react-hot-toast";

async function generateGameList(idList, dm) {
  let gameList = [];
  for (const entry of idList) {
    const gameRef = doc(db, `game`, entry.id);
    const gameMemberRef = collection(db, 'game', entry.id, 'members');

    let game = reconstructDoc(await getDoc(gameRef));
    game.members = toArray(await getDocs(gameMemberRef));
    if (dm) {
      game.inviteCode = entry.inviteCode;
    }
    gameList.push(game)
  }
  return gameList;
}

function checkActive(gameDoc) {
  let isMember = false;
  let uid = userAuth.currentUser.uid;
  let isDm = gameDoc.uid === uid;

  //Search for user in members
  for (let member of gameDoc.members) {
    if (member === uid) {
      isMember = true;
      break;
    }
  }
  return {isDm, isMember};
}

export const fbManagement = {
  live: {
    userIsDmGames:
      async (callback) => {
        const dmListRef = collection(db, `user`, userAuth.currentUser.uid, 'dmList');
        onSnapshot(dmListRef, async (snapshot) => {
          callback(await generateGameList(toArray(snapshot), true));
        })
      },
    userIsPlayerGames:
      async (callback) => {
        const playerListRef = collection(db, `user`, userAuth.currentUser.uid, 'playerList');
        onSnapshot(playerListRef, async (snapshot) => {
          callback(await generateGameList(toArray(snapshot)));
        })
      },
    memberJoined:
      async (game, callBack) => {
        const gameMemberRef = collection(db, 'game', game.id, 'members');
        let compoundClause;
        for (let member of game.members) {
          if (compoundClause) {
            compoundClause = and(compoundClause, where('id', '!=', member.id))
          } else {
            compoundClause = where('id', '!=', member.id)
          }
        }
        const q = query(gameMemberRef, compoundClause && compoundClause);
        return onSnapshot(q, async (snapshot) => {
          let memberList = toArray(snapshot);
          if (memberList.length > 0) {
            toast.success(`${memberList[0].uName} has joined the game: ${game.name}`);
            callBack(await fbManagement.get.userIsDmGames());
            return toArray(snapshot);
          }
        })
      }
  },
  get: {
    publicGames:
      async () => {
        let publicGamesRef = doc(db, `game`, `availableGames`);
        let availableGameDoc = await getDoc(publicGamesRef);
        let idList = availableGameDoc.data().idList || [];
        let gameList = [];

        for (let id of idList) {
          const gameRef = doc(db, `game`, id);
          const joinGameRef = doc(db, `game`, id, `joinRequest`, userAuth.currentUser.uid)

          let gameDoc = reconstructDoc(await getDoc(gameRef));
          let joinRequest = await getDoc(joinGameRef);
          let {isMember, isDm} = checkActive(gameDoc)

          gameDoc.userRequest = (joinRequest.exists()) ? joinRequest.data().status : 'none';
          if (!isMember && !isDm) {
            gameList.push(gameDoc)
          }
        }
        return gameList
      },
    singleGame:
      async (gameId) => {
        const gameRef = doc(db, `game`, gameId);
        const gameMemberRef = collection(db, 'game', gameId, 'members');

        let game = reconstructDoc(await getDoc(gameRef));
        game.members = toArray(await getDocs(gameMemberRef));
        return game;
      },
    userIsDmGames:
      async () => {
        const dmListRef = collection(db, `user`, userAuth.currentUser.uid, 'dmList');
        let dmGameList = toArray(await getDocs(dmListRef));
        return await generateGameList(dmGameList, true);
      },
    userIsPlayerGames:
      async () => {
        const playerListRef = collection(db, `user`, userAuth.currentUser.uid, 'playerList');
        let playerGameList = toArray(await getDocs(playerListRef));
        return await generateGameList(playerGameList);
      },
  },
  dm: {
    createGame:
      async (data) => {
        //Create Game Entry in Database
        const {uid, displayName} = userAuth.currentUser;
        const gameCollection = collection(db, `game`);
        data.uid = uid;
        data.uName = displayName;
        data.createdAt = Date.now();
        data.started = false;
        data.completed = false;
        data.completionResult = 'none';

        let newGameRef = await addDoc(gameCollection, data);

        //Create an invite-code for the game
        const inviteRef = collection(db, 'invite');
        let invite = await addDoc(inviteRef, {
          createdAt: Date.now(),
          expiryTime: 604800000,
          uid: userAuth.currentUser.uid,
          uName: userAuth.currentUser.displayName,
          gameId: newGameRef.id
        })

        //Add to user list of games they are DM of along with an invite-code to the game.
        const dmListGameRef = doc(db, `user`, userAuth.currentUser.uid, 'dmList', newGameRef.id);
        await setDoc(dmListGameRef, {
          started: false,
          completed: false,
          completionResult: '',
          inviteCode: invite.id
        })

        //Add game to public list if set to true by user
        if (data.isPublic) {
          let publicGamesRef = doc(db, `game`, `availableGames`);
          let publicGamesDoc = await getDoc(publicGamesRef);
          let idList = publicGamesDoc.data().idList || [];
          idList.push(newGameRef.id);

          await updateDoc(publicGamesRef, {idList});
        }
      },
    startGame:
      async (gameId) => {
        const uid = userAuth.currentUser.uid;
        const updateGameRef = doc(db, 'game', gameId);
        const gameMemberRef = collection(db, 'game', gameId, 'members');

        let game = reconstructDoc(await getDoc(updateGameRef));
        game.members = toArray(await getDocs(gameMemberRef));

        await updateDoc(updateGameRef, {
          started: true
        })

        const updateUserGameRef = doc(db, 'user', uid, 'dmList', gameId);
        await updateDoc(updateUserGameRef, {
          started: true
        })

        for (let member of game.members) {
          const userPlayerListRef = doc(db, 'user', member.id, 'playerList', gameId);
          await updateDoc(userPlayerListRef, {
            started: true
          })
        }
      },
    updateGame:
      async (gameId, data) => {
        const updateGameRef = doc(db, 'game', gameId);
        await updateDoc(updateGameRef, data)
      },
    denyJoinRequest:
      async (gameId, userId) => {
        //Delete request Document from game
        const requestIdRef = doc(db, `game`, gameId, `joinRequest`, userId)
        await updateDoc(requestIdRef, {
          status: 'denied'
        });
      },
  },
  player: {
    acceptInviteLink:
      async (inviteCode, gameId) => {
        const {uid, displayName} = userAuth.currentUser;

        const gameRef = doc(db, 'game', gameId);
        const gameMemberRef = collection(db, 'game', gameId, 'members');

        let game = reconstructDoc(await getDoc(gameRef));
        let members = toArray(await getDocs(gameMemberRef));

        if (members.length >= game.maxPlayers) {
          return {success: false, message: 'Game already at player max.'}
        }
        for (let member of members) {
          if (member.id === uid) {
            return {success: false, message: 'You are already in this game.'}
          }
        }
        //Update Game to have user as member
        const addGameMemberRef = doc(db, 'game', gameId, 'members', uid);
        await setDoc(addGameMemberRef, {
          uName: displayName,
          joinDate: Date.now(),
          inviteCode
        })

        const userPlayerListRef = doc(db, 'user', uid, 'playerList', gameId);
        await setDoc(userPlayerListRef, {
          started: game.started,
          completed: game.completed,
          completionResult: game.completionResult
        })
      },
    findGameFromInviteCode:
      async (inviteCode) => {
        const inviteRef = doc(db, 'invite', inviteCode);
        let invite = reconstructDoc(await getDoc(inviteRef));
        if (!invite) return null;

        const gameRef = doc(db, 'game', invite.gameId);
        let game = reconstructDoc(await getDoc(gameRef));
        if (!game) return null;

        const memberRef = collection(db, 'game', invite.gameId, 'members')
        game.members = toArray(await getDocs(memberRef))
        return (game)
      },
    joinPublicGame:
      async (gameId) => {
        const joinGameRef = doc(db, `game`, gameId, `joinRequest`, userAuth.currentUser.uid);
        await setDoc(joinGameRef, {
          uName: userAuth.currentUser.displayName,
          requestDate: Date.now(),
          status: 'pending'
        })
      },
    cancelJoinRequest:
      async (gameId) => {
        const joinGameRef = doc(db, `game`, gameId, `joinRequest`, userAuth.currentUser.uid);
        await deleteDoc(joinGameRef);
      },

  }
}