import firebaseApp from "./initialize"
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { getFirestore, doc, getDoc, collection, setDoc, onSnapshot } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore(firebaseApp);
var fileRef;
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'http://localhost:3000';
    } else {
        const unsub = onSnapshot(doc(db, "dispatch", auth.currentUser.uid), (doc) => {
            console.log('データ取得');
            console.log(doc.data());
            if (doc.data()) {
                fileRef = doc.data()['dataRef'];
                console.log('data is not null');
                document.getElementById('upload_div').style.display = 'block';
                document.getElementById('error').style.display = 'none';
            } else {
                console.log('data is null');
                document.getElementById('error').style.display = 'block';
                document.getElementById('upload_div').style.display = 'none';

            }
        });
    }
})

document.getElementById('upload').addEventListener('click', () => {
    if (fileRef) {
        auth.currentUser.getIdTokenResult(true).then(result => {
            console.log(JSON.stringify(result.claims));
            const storage = getStorage();
            const storageRef = ref(storage, "users/" + auth.currentUser.uid + "/music/" + fileRef);
            const [file] = document.getElementById('selector').files;
            uploadBytes(storageRef, file).then((snapshot) => {
                console.log('upload success');
            });
        })
    }
});