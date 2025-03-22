import {db, reconstructDoc, userAuth} from "@/javascript/firebase/base";
import toast from "react-hot-toast";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  Timestamp,
  updateDoc,
  where
} from "firebase/firestore";
import {fbUtilManager} from "@/javascript/firebase/managers/fbUtilManager";
import {lsAccount} from "@/javascript/util/localStorage";

export const fbAccountManager = {
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

  get: {
    accountDetails: async (uid) => {
      const userInfoRef = doc(db, 'user', uid);
      let details = await getDoc(userInfoRef);
      return reconstructDoc(details);
    }
  },

  update: {
    /**
     * Update user's display name
     *
     * @param {object} user The user object from firebase .
     * @param {string} newUName The new text to update the display name.
     */
    uName: async (user, newUName) => {
      const userInfoPrivateRef = doc(db, 'user', user.uid);
      const userInfoPrivate = await getDoc(userInfoPrivateRef);
      let privateUpdated = false;

      if (userInfoPrivate.exists()) {
        privateUpdated = updateDoc(userInfoPrivateRef, {uName: newUName, uNameConfirmation: true})
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
      const userInfoRef = doc(db, 'user', user.uid);
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

  live: {
    userUpdate: (userDetails, callback) => {
      const userInfoRef = doc(db, 'user', userDetails.id);

      return onSnapshot(userInfoRef, async (snapshot) => {
        callback(reconstructDoc(snapshot));
      })
    },
    fullUpdates: (userDetails, setUserDetails, gmGames, setGames) => {
      let time = lsAccount.getLastOtherUpdateTime(userDetails.id);
      const q = query(collection(db, 'user', userDetails.id, 'liveUpdates'), where('updatedAt', '>=', time));
      return onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          let data = reconstructDoc(change.doc)
          if (change.type === "added") {
            if (data.type === `gmGame`) {
              let user = await fbUtilManager.get.user(data.data.uid);
              let newGames = [];
              if (gmGames) {
                for (let i = 0; i < gmGames.length; i++) {
                  if (gmGames[i].id === data.data.gid) {
                    newGames.push(await fbUtilManager.get.game(data.data.gid));
                    if (data.data.field === `joinRequests`) {
                      toast(`${user.uName} has requested to join the game: ${gmGames[i].name}`)
                    } else if (data.data.field === `players`) {
                      toast(`${user.uName} has been added to: ${gmGames[i].name}`)
                    }
                  } else {
                    newGames.push(gmGames[i])
                  }
                }
              }
              setGames(newGames);
            }
          } else if (change.type === "removed") {

          }
        })
      })
    }
  }
}