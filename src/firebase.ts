import firebase from 'firebase/compat/app';
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";
import "firebase/compat/functions";

import { isDev } from './config';

async function InitFirebase(): Promise<void> {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
  
  if (!firebase.apps.length) {
    console.log("Initializing firebase app");
    firebase.initializeApp(firebaseConfig);
    if (await firebase.analytics.isSupported()) {
      console.log("Initializing firebase analytics");
      firebase.analytics();
    }
    if (isDev) {
      // firebase.database().useEmulator("localhost", 9000);
      console.log("Initializing firebase functions emulator on port 5001");
      firebase.functions().useEmulator("localhost", 5001);
    } 
    else {
      // firebase.analytics();
    }
  }
}

InitFirebase()

export const authProvider = new firebase.auth.GoogleAuthProvider();

const functions = firebase.functions();
export const createGame = functions.httpsCallable("createGame");

export default firebase