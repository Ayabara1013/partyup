import { initializeApp } from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const clientCredentials = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const fireApp = initializeApp(clientCredentials);

const db = getFirestore(fireApp);
const userAuth = getAuth(fireApp);

const googleSignInPopUp = (func) => {
  signInWithPopup(userAuth, new GoogleAuthProvider()).then(data => {
    if (typeof func === 'function') {
      func(data);
    }
  })
}

export {
  db,
  fireApp,
  userAuth,
  googleSignInPopUp,
};