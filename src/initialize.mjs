import { getApps, getApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD0l1GqDOFGaqeU4rJJndfzTwMq4F_-C4w",
  authDomain: "testproject-827f5.firebaseapp.com",
  projectId: "testproject-827f5",
  storageBucket: "testproject-827f5.appspot.com",
  messagingSenderId: "438614325227",
  appId: "1:438614325227:web:fbf96687d46441cf7f4bae",
  measurementId: "G-70FXYW81PE",
};

const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const db = getFirestore(firebaseApp);
export const auth = getAuth();
export const storage = getStorage();
