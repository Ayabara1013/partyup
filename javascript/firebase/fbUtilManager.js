import {collection, doc, getDoc, getDocs, query, where} from "firebase/firestore";
import {db, reconstructDoc, toArray} from "@/javascript/firebase/base";

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
    user: async function (uid) {
      return reconstructDoc(await getDoc(doc(db, `user`, uid)));
    }
  }
}