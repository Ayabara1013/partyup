import {doc, getDoc, setDoc} from "firebase/firestore";
import {db, reconstructDoc} from "@/javascript/firebase/base";
import toast from "react-hot-toast";
import {starborne as user} from "@/test/fake firestore/tavern-test-1/collections/firestoreObjects";

export const fbPlayerManager = {
  general: {
    get: {
      gameFromId: async function (gameId) {
        const gameRef = doc(db, `game`, gameId);
        return getDoc(gameRef).then(doc => {
          return reconstructDoc(doc);
        }).catch(() => {
          return null;
        });
      },
      gameFromInvite: async function (gameId, inviteCode) {
        const gameRef = doc(db, `game`, gameId, `invites`, inviteCode);
        return getDoc(gameRef).then(doc => {
          return reconstructDoc(doc);
        }).catch(() => {
          return null;
        });
      }
    },
    joinGame: async function (userDetails, gameId, inviteCode) {
      console.log(userDetails, gameId, inviteCode);
      const gameReqRef = doc(db, `game`, gameId, `joinRequests`, userDetails.id);

      if ((await getDoc(doc(db, `game`, gameId, `members`, userDetails.id))).exists()) {
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