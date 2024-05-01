// Import the functions you need from the SDKs you need

import { getAnalytics } from "firebase/analytics";
import { getFirestore,doc, getDoc, collection, setDoc, onSnapshot } from "firebase/firestore";
console.log('load')
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebaseApp from "./initialize";
const db = getFirestore(firebaseApp);
const analytics = getAnalytics(firebaseApp);

import { GoogleAuthProvider, signOut } from "firebase/auth";
import { getAuth, signInWithPopup } from "firebase/auth";

const provider = new GoogleAuthProvider();
//always select account
provider.setCustomParameters({
  prompt: 'select_account'
});

const auth = getAuth();
auth.onAuthStateChanged(function (user) {
  if (user) {
    window.location.href = 'http://localhost:3000/top'
  } else {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user.uid)
        // IdP data available using getAdditionalUserInfo(result)
      }).catch((error) => {
        console.log(error)
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
})

