// noinspection JSCheckFunctionSignatures
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, query, setDoc, updateDoc, and, where } from "firebase/firestore";

import { db, userAuth } from "@/firebase/base";
import { toastUser } from "@/util/functions";

function reconstructDoc(doc) {
  try {
    let data = doc.data();
    data.id = doc.id;
    return data;
  } catch (e) {
    return null;
  }
}

async function generateDmList(gameIdList){
  let gameList = [];
  for (const dmGame of gameIdList) {
    // let requestList = []
    // let requestsDocs = toArray(await getDocs(requestRef));
    // for (let request of requestsDocs) {
    //   requestList.push(reconstructDoc(request))
    // }
    // const requestRef = collection(db, `game`, dmGame.id, `joinRequest`);

    const gameRef = doc(db, `game`, dmGame.id);
    const gameMemberRef = collection(db, 'game', dmGame.id, 'members');

    let game = reconstructDoc(await getDoc(gameRef));
    game.members = toArray(await getDocs(gameMemberRef));

    gameList.push({ game, inviteCode: dmGame.inviteCode })
  }
  return gameList;
}

async function generatePlayerList(gameIdList) {
  let gameList = [];

  for (const item of gameIdList) {
    const gameRef = doc(db, `game`, item.id);
    const gameMemberRef = collection(db, 'game', item.id, 'members');
    let game = reconstructDoc(await getDoc(gameRef));
    game.members = toArray(await getDocs(gameMemberRef));
    gameList.push(game)
  }
  return gameList;
}

function toArray(docs) {
  let docArray = [];
  docs.forEach(doc => {
    docArray.push(reconstructDoc(doc))
  })
  return docArray;
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
  return { isDm, isMember };
}

export const fbManagement = {
  live:{
    userIsDmGames:
      async (callback) => {
        const dmListRef = collection(db, `user`, userAuth.currentUser.uid, 'dmList');
        onSnapshot(dmListRef, async (snapshot) => {
          callback(await generateDmList(toArray(snapshot)));
        })
      },
    userIsPlayerGames:
      async (callback) => {
        const playerListRef = collection(db, `user`, userAuth.currentUser.uid, 'playerList');
        onSnapshot(playerListRef, async (snapshot) => {
          callback(await generatePlayerList(toArray(snapshot)));
        })
      },
    memberJoined:
      async (game, callBack) => {
        const gameMemberRef = collection(db, 'game', game.id, 'members');
        let compoundClause;
        for(let member of game.members){
          if (compoundClause){
            compoundClause = and(compoundClause, where('id', '!=', member.id))
          } else{
            compoundClause = where('id', '!=', member.id)
          }
        }
        console.log(compoundClause)
        const q = query(gameMemberRef, compoundClause && compoundClause);
        return onSnapshot(q, async (snapshot) => {
          let memberList = toArray(snapshot);
          if(memberList.length > 0){
            toastUser(`${memberList[0].uName} has joined the game: ${game.name}`)
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
          let { isMember, isDm } = checkActive(gameDoc)

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
        return await generateDmList(dmGameList);
      },
    userIsPlayerGames:
      async () => {
        const playerListRef = collection(db, `user`, userAuth.currentUser.uid, 'playerList');
        let playerGameList = toArray(await getDocs(playerListRef));
        return await generatePlayerList(playerGameList);
      },
  },
  dm: {
    createGame:
      async (name, description, isPublic, playerMax) => {
        //Create Game Entry in Database
        const { uid, displayName } = userAuth.currentUser;
        const gameCollection = collection(db, `game`);
        let newGameRef = await addDoc(gameCollection, {
          name, description, isPublic, playerMax,
          createdAt: Date.now(),
          uid: uid,
          uName: displayName,
          started: false,
          completed: false,
          completionResult: 'none'
        })

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
        if (isPublic) {
          let publicGamesRef = doc(db, `game`, `availableGames`);
          let publicGamesDoc = await getDoc(publicGamesRef);
          let idList = publicGamesDoc.data().idList || [];
          idList.push(newGameRef.id);

          await updateDoc(publicGamesRef, { idList });
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

        // const publicGamesRef = doc(db, `game`, `availableGames`);
        // let publicGamesDoc = await getDoc(publicGamesRef);
        // let idList = publicGamesDoc.data().idList || [];
        // let index = idList.indexOf(gameId);
        //
        // if (index >= 0) {
        //   idList.splice(index, 1)
        //   await updateDoc(publicGamesRef, { idList });
        // }
      },
    updateGame:
      async (gameId, name, description, isPublic, playerMax) => {
        const updateGameRef = doc(db, 'game', gameId);
        await updateDoc(updateGameRef, {
          name, description, isPublic, playerMax
        })

        let publicGamesRef = doc(db, `game`, `availableGames`);
        let publicGamesDoc = await getDoc(publicGamesRef);
        let idList = publicGamesDoc.data().idList || [];

        if (isPublic) {
          let addToList = true;
          for (let id of idList) {
            if (gameId === id) {
              addToList = false;
              break;
            }
          }
          if (addToList) {
            idList.push(gameId);
          }
        } else {
          let index = idList.indexOf(gameId)
          if (index >= 0) {
            idList.splice(index, 1)
          }
        }
        await updateDoc(publicGamesRef, { idList });
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
        const { uid, displayName } = userAuth.currentUser;

        const gameRef = doc(db, 'game', gameId);
        const gameMemberRef = collection(db, 'game', gameId, 'members');

        let game = reconstructDoc(await getDoc(gameRef));
        let members = toArray(await getDocs(gameMemberRef));

        if (members.length >= game.playerMax) {
          return { success: false, message: 'Game already at player max.' }
        }
        for (let member of members) {
          if (member.id === uid) {
            return { success: false, message: 'You are already in this game.' }
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