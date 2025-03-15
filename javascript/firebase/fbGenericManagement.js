// noinspection JSCheckFunctionSignatures
import {
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

import {db, reconstructDoc, toArray, userAuth} from "@/javascript/firebase/base";
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

export const fbGenericManagement = {
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
            callBack(await fbGenericManagement.get.userIsDmGames());
            return toArray(snapshot);
          }
        })
      },
  },
  get: {
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
          uName: userAuth.currentUser.uName,
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
