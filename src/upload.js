/*
import { auth, db } from "./initialize.mjs";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, onSnapshot } from "firebase/firestore";

var fileRef;
auth.onAuthStateChanged((user) => {
  if (!user) {
    window.location.href = "http://localhost:3000";
  } else {
    const unsub = onSnapshot(
      doc(db, "dispatch", auth.currentUser.uid),
      (doc) => {
        console.log("データ取得");
        console.log(doc.data());
        if (doc.data()) {
          fileRef = doc.data().dataRef;
          console.log("data is not null");
          document.getElementById("upload_div").style.display = "block";
          document.getElementById("error").style.display = "none";
        } else {
          console.log("data is null");
          document.getElementById("error").style.display = "block";
          document.getElementById("upload_div").style.display = "none";
        }
      }
    );
  }
});

document.getElementById("upload").addEventListener("click", () => {
  if (fileRef) {
    auth.currentUser.getIdTokenResult(true).then((result) => {
      console.log(JSON.stringify(result.claims));
      const storage = getStorage();
      const storageRef = ref(
        storage,
        "users/" + auth.currentUser.uid + "/music/" + fileRef
      );
      const [file] = document.getElementById("selector").files;
      uploadBytes(storageRef, file).then((snapshot) => {
        console.log("upload success");
      });
    });
  }
});
*/

import { onAuthStateChanged, redirectToLoginPage } from "./auth.mjs";
import {
  getMusicURLs,
  getPreviousMusicURLs,
  updateDispatchUI,
  uploadMusic,
} from "./music.mjs";

function setup() {
  updateDispatchUI(async (doc) => {
    if (doc.data()) {
      //データが存在=曲が割り当てられていた時
      console.log("data is not null");
      document.getElementById("upload_div").style.display = "block";
      document.getElementById("error").style.display = "none";
      //TODO 表示
      try {
        for (const url of await getMusicURLs(
          doc.data().authorIds,
          doc.data().previousRefs
        )) {
          console.log(url);
        }
      } catch (error) {
        console.error("There was an error while retrieving the music URLs.");
        console.log(error);
      }
    } else {
      //データが存在しない=曲が割り当てられていない時
      console.log("data is null");
      document.getElementById("error").style.display = "block";
      document.getElementById("upload_div").style.display = "none";
    }
  });

  document.getElementById("upload").addEventListener("click", () => {
    const [file] = document.getElementById("selector").files;
    try {
      uploadMusic(file);
    } catch (error) {
      console.error("failed to upload the music.");
    }
  });
}

onAuthStateChanged(setup, redirectToLoginPage);
