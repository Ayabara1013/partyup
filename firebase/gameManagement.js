import { collection, doc, getDocs, addDoc, setDoc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db, userAuth } from "@/firebase/base";


function reconstructDoc(doc){
    let data = doc.data();
    data.id = doc.id;
    return data;
}

function toArray(docs){
    let docArray = [];
    docs.forEach(doc=>{
        docArray.push(doc)
    })
    return docArray;
}

function checkActive(gameDoc){
    let isMember = false;
    let uid = userAuth.currentUser.uid;
    let isDm = gameDoc.uid === uid;

    //Search for user in members
    for(let member of gameDoc.members){
        if(member === uid){
            isMember = true;
            break;
        }
    }
    return {isDm, isMember};
}

export const gameManagement = {
    createGame:
        async (name, description, isPublic, playerMax) => {
            //Create Game Entry
            const { uid, displayName} = userAuth.currentUser;
            const gameCollection = collection(db, `game`);
            let newGameRef = await addDoc(gameCollection, {
                name, description, isPublic, playerMax,
                createdAt:  Date.now(),
                uid: uid,
                uName: displayName,
                members: [],
                started: false,
                completed: false
            })

            //Add to user list of games they are DM of.
            const dmListGameRef = doc(db, `user`, userAuth.currentUser.uid, 'dmList', newGameRef.id);
            await setDoc(dmListGameRef, {
                started:false,
                completed: false,
                abandoned: false
            })

            //Add game to public list if exist
            if(isPublic){
                let publicGamesRef = doc(db, `game`, `availableGames`);
                let publicGamesDoc = await getDoc(publicGamesRef);
                let idList = publicGamesDoc.data().idList || [];
                idList.push(newGameRef.id);

                await updateDoc(publicGamesRef,{idList});
            }
        },

    grabGame:
        async(gameId)=>{
            const gameRef = doc(db, `game`, gameId);
            return reconstructDoc(await getDoc(gameRef));

        },

    startGame:
        async (gameId) => {
            const uid = userAuth.currentUser.uid;
            const updateGameRef = doc(db, 'game', gameId);
            let game = reconstructDoc(await getDoc(updateGameRef));
            if(game.members.length > 0){
                await updateDoc(updateGameRef, {
                    started: true
                })

                const updateUserGameRef = doc(db, 'user', uid, 'dmList', gameId);
                await updateDoc(updateUserGameRef, {
                    started: true
                })

                for(let memberId of game.members){
                    const userPlayerListRef = doc(db, 'user', memberId, 'playerList', gameId);
                    await updateDoc(userPlayerListRef, {
                        started: true
                    })
                }

                const publicGamesRef = doc(db, `game`, `availableGames`);
                let publicGamesDoc = await getDoc(publicGamesRef);
                console.log(publicGamesDoc)
                let idList = publicGamesDoc.data().idList || [];
                let index = idList.indexOf(gameId);

                if(index >= 0){
                    idList.splice(index, 1)
                    await updateDoc(publicGamesRef,{idList});
                }
            }
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

            if(isPublic){
                let addToList = true;
                for(let id of idList){
                    if(gameId === id){
                        addToList = false;
                        break;
                    }
                }
                if(addToList){
                    idList.push(gameId);
                }
            } else{
                let index = idList.indexOf(gameId)
                if(index >= 0){
                    idList.splice(index, 1)
                }
            }
            await updateDoc(publicGamesRef,{idList});
        },

    acceptJoinRequest:
        async(gameId, userId)=>{
            //Delete request Document
            const requestIdRef = doc(db, `game`, gameId, `joinRequest`, userId)
            await deleteDoc(requestIdRef);

            //Update Game to have user as member
            const updateGameRef = doc(db, 'game', gameId);
            let game = reconstructDoc(await getDoc(updateGameRef));
            let members = game.members;
            members.push(userId);
            await updateDoc(updateGameRef, {
                members
            })

            //Update user to have the game added to their player games
            const userPlayerListRef = doc(db, 'user', userId, 'playerList', gameId);
            await setDoc(userPlayerListRef, {
                started: false,
                completed: false,
                abandoned: false
            })

        },

    denyJoinRequest:
        async(gameId, userId)=>{
            //Delete request Document
            const requestIdRef = doc(db, `game`, gameId, `joinRequest`, userId)
            await updateDoc(requestIdRef, {
                status: 'denied'
            });
        },

    cancelJoinRequest:
        async (gameId) =>{
            const joinGameRef = doc(db, `game`, gameId, `joinRequest`, userAuth.currentUser.uid);
            await deleteDoc(joinGameRef);
        },

    joinGame:
        async (gameId) => {
            const joinGameRef = doc(db, `game`, gameId, `joinRequest`, userAuth.currentUser.uid);
            await setDoc(joinGameRef, {
                uName: userAuth.currentUser.displayName,
                requestDate: Date.now(),
                status: 'pending'
            })
        },

    getPublicGames:
        async ()=>{
            let publicGamesRef = doc(db, `game`, `availableGames`);
            let availableGameDoc = await getDoc(publicGamesRef);
            let idList = availableGameDoc.data().idList || [];
            let gameList = [];

            for(let id of idList){
                const gameRef = doc(db, `game`, id);
                const joinGameRef = doc(db, `game`, id, `joinRequest`, userAuth.currentUser.uid)

                let gameDoc = reconstructDoc(await getDoc(gameRef));
                let joinRequest = await getDoc(joinGameRef);
                let { isMember, isDm } = checkActive(gameDoc)

                gameDoc.userRequest = (joinRequest.exists())?joinRequest.data().status:'none';
                if(!isMember && !isDm)
                {
                    gameList.push(gameDoc)
                }
            }
            return gameList
        },

    getUserDmGames:
        async () => {
            const dmListRef = collection(db, `user`, userAuth.currentUser.uid, 'dmList');
            let dmGameList = toArray(await getDocs(dmListRef));
            let gameList = [];

            for (const dmGame of dmGameList) {
                const gameRef = doc(db, `game`, dmGame.id);
                const requestRef = collection(db, `game`, dmGame.id, `joinRequest`);

                let game = reconstructDoc(await getDoc(gameRef));
                let requestsDocs = toArray(await getDocs(requestRef));
                let requestList = []
                for(let request of requestsDocs){
                    requestList.push(reconstructDoc(request))
                }
                gameList.push({game, requestList})
            }
            return gameList;
        },

    getUserPlayerGames:
        async () => {
            const playerListRef = collection(db, `user`, userAuth.currentUser.uid, 'playerList');

            let playerGameList = toArray(await getDocs(playerListRef));
            let gameList = [];

            for (const item of playerGameList) {
                const gameRef = doc(db, `game`, item.id);
                let game = reconstructDoc(await getDoc(gameRef));
                gameList.push(game)
            }
            return gameList;
        },
}