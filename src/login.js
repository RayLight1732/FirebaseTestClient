import { GoogleAuthProvider } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import { onAuthStateChanged } from "./auth.mjs";
import { auth } from "./initialize.mjs";

const provider = new GoogleAuthProvider();
//always select account
provider.setCustomParameters({
  prompt: "select_account",
});

function redirectToTopPage() {
  window.location.href = "http://localhost:3000/top";
}

function login() {
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
    })
    .catch((error) => {
      console.log(error);
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
onAuthStateChanged(redirectToTopPage, login);
