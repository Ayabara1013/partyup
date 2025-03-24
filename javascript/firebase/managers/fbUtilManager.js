import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {cleanUserData, db, reconstructDoc, toArray} from "@/javascript/firebase/base";

export const fbUtilManager = {
  //Methods for checking availability of account details.
  checkAvailability: {
    /**
     * Check display name availability
     *
     * @param {string} displayName The display name up for scrutiny.
     */
    uName: async (displayName) => {
      const q = query(collection(db, `user`), where('uName', '==', displayName));

      return toArray(await getDocs(q)).length === 0;
    }
  },
  get: {
    cleanUser: async (uid) => {
      return cleanUserData(reconstructDoc(await getDoc(doc(db, `user`, uid))));
    },
    user: async function (uid) {
      return reconstructDoc(await getDoc(doc(db, `user`, uid)));
    },
    game: async function (gid) {
      let tempGame = reconstructDoc(await getDoc(doc(db, `game`, gid)));
      tempGame.inviteCode = toArray(await getDocs(collection(db, `game`, gid, 'invites')))[0].id;
      return tempGame;
    },
    gmGames: async function (uid) {
      let gidList = reconstructDoc(await getDoc(doc(db, `user`, uid))).gmGames;
      const games = [];
      for (let gid of gidList) {
        games.push(await this.game(gid));
      }
      return games;
    },
    playerGames: async function (uid) {
      let gidList = reconstructDoc(await getDoc(doc(db, `user`, uid))).playerGames;
      const games = [];
      for (let gid of gidList) {
        games.push(await this.game(gid));
      }
      return games;
    },
    joinRequestGames: async function (uid) {
      let gidList = reconstructDoc(await getDoc(doc(db, `user`, uid))).joinRequestGames;
      const games = [];
      for (let gid of gidList) {
        games.push(await this.game(gid));
      }
      return games;
    },
  }
}