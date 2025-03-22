import {doc, getDoc, setDoc} from "firebase/firestore";
import {db, reconstructDoc, userAuth} from "@/javascript/firebase/base";
import toast from "react-hot-toast";
import {starborne as user} from "@/javascript/__tests/jeremy/fake firestore/tavern-test-1/collections/firestoreObjects";

export const fbPlayerManager = {
  general: {
    get: {
      game: {
        fromId: async function (gameId) {
          const gameRef = doc(db, `game`, gameId);
          return getDoc(gameRef).then(doc => {
            return reconstructDoc(doc);
          }).catch(() => {
            return null;
          });
        },
        fromInvite: async function (gameId, inviteCode) {
          const gameRef = doc(db, `game`, gameId, `invites`, inviteCode);
          return getDoc(gameRef).then(doc => {
            return reconstructDoc(doc);
          }).catch(() => {
            return null;
          });
        },
      },
      gameList: {
        allPlayerGames: async function (inviteCode) {

        },
        allJoinRequestGames: async function (inviteCode) {

        }
      }
    },
    joinGame: async function (gameId, inviteCode) {
      const gameReqRef = doc(db, `game`, gameId, `joinRequests`, userAuth.currentUser.uid);

      if ((await getDoc(doc(db, `game`, gameId, `members`, userAuth.currentUser.uid))).exists()) {
        toast.error("You are already apart of this game.");
        return false;
      }
      if ((await getDoc(gameReqRef)).exists()) {
        toast.success("Join request successful.");
        return true;
      }
      return await setDoc(gameReqRef, {inviteCode}).then(() => {
        toast.success("Join request successful.");
        return true;
      }).catch(async e => {
        toast.error("Join request failed. Something went wrong.");
        return false;
      });
    }
  },
  inGame: {}
}