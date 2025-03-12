import {db, reconstructDoc, toArray, userAuth} from "@/javascript/firebase/base";
import toast from "react-hot-toast";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {collection, doc, getDoc, getDocs, query, updateDoc, where} from "firebase/firestore";

export const fbAccountManagement = {
  //Methods for account creation.
  create: {
    /**
     * Create an account via email and password
     *
     * @param {string} email The email for the account.
     * @param {string} password The password for the account
     */
    withEP: async (email, password,) => {
      toast(`Sending signup information...`)
      //pull up default signup method from node module and do some custom returns
      return await createUserWithEmailAndPassword(userAuth, email, password)
        .then((uc) => {
          return true;
        })
        .catch((e) => {
          toast.error(`Something went wrong, please try again.`)
          console.log(e)
          return false;
        })
    }
  },

  //Methods for checking availability of account details.
  checkAvailability: {
    /**
     * Check display name availability
     *
     * @param {string} displayName The display name up for scrutiny.
     */
    displayName: async (displayName) => {
      //Use a ref then query to reduce the read count.
      const userCollectionRef = collection(db, `user-public`);
      const q = query(userCollectionRef, where('displayName', '==', displayName));

      return toArray(await getDocs(q)).length === 0;
    }
  },

  get: {
    accountDetails: async (uid) => {
      const userInfoRef = doc(db, 'user-private', uid);
      let details = await getDoc(userInfoRef);
      return reconstructDoc(details);
    }
  },

  update: {
    /**
     * Update user's display name
     *
     * @param {object} user The user object from firebase .
     * @param {string} newDisplayName The new text to update the display name.
     */
    displayName: async (user, newDisplayName) => {
      const userInfoPrivateRef = doc(db, 'user-private', user.uid);
      const userInfoPrivate = await getDoc(userInfoPrivateRef);
      let privateUpdated = false;

      if (userInfoPrivate.exists()) {
        privateUpdated = updateDoc(userInfoPrivateRef, {displayName: newDisplayName, displayNameConfirmation: true})
          .then(() => {
            return true;
          })
          .catch((e) => {
            console.log(e)
            return false;
          })
      } else {
        toast.error(`Your account details files have not yet been created. Please try again.`)
      }
      return (privateUpdated);
    },

    /**
     * Update user's subscription tier. Basic placeholder until we get a payment system in.
     *
     * @param {object} user The user object from firebase.
     * @param {int} tier The new tier to update too.
     */
    subscription: async (user, tier) => {
      console.log(user)
      const userInfoRef = doc(db, 'user-private', user.uid);
      return await updateDoc(userInfoRef, {planTier: tier, planConfirmation: true})
        .then(() => {
          return true;
        })
        .catch((e) => {
          console.log(e)
          return false;
        })
    }
  },
}