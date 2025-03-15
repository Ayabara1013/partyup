import {doc, getDoc, setDoc} from "firebase/firestore";
import {db, reconstructDoc} from "@/javascript/firebase/base";

export const fbPlayerManagement = {
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
      const gameRef = doc(db, `game`, gameId, `joinRequest`, userDetails.id);
      let data = {
        uName: userDetails.uName,
        inviteCode
      };
      return setDoc(gameRef, data).then(() => {
        return true;
      }).catch(e => {
        return false;
      });
    }
  },
  inGame: {}
}