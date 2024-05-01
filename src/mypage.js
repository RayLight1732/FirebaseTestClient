import { getFirestore, doc, getDoc, collection, setDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import firebaseApp from "./initialize"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const db = getFirestore(firebaseApp);


const auth = getAuth()
const button = document.getElementById('update')
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'http://localhost:3000'
    } else {
        setup()
    }
})
function setup() {
    console.log('検証完了')
    const imageSelector = document.getElementById('image_selector')
    const figureImage = document.getElementById('figure_image')
    const figure = document.getElementById('figure')
    imageSelector.addEventListener('change', (event) => {
        const [file] = event.target.files
        if (file) {
            figureImage.setAttribute('src', URL.createObjectURL(file))
            figure.style.display = 'block'
        } else {
            figure.style.display = 'none'
        }
    })

    const name = document.getElementById('name')
    const favorite = document.getElementById('favorite')
    const part = document.getElementById('part_selector')
    const storage = getStorage()
    const storageRef = ref(storage, "users/" + auth.currentUser.uid + "/profile.png")

    getDownloadURL(storageRef).then(url => {
        if (url) {
            figureImage.setAttribute('src', url)
            figure.style.display = 'block'
        } else {
            figure.style.display = 'none'
        }
    }).catch(ignore => { });
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
        console.log('データ取得1')
        console.log(doc.data())
        if (doc.data()) {
            name.value = doc.data().name
            favorite.value = doc.data().favorite
            part.value = doc.data().part
        }
    });
    button.addEventListener('click', async () => {
        if (auth.currentUser) {
            console.log('current user is not null')
            //画像のアップロード
            const storage = getStorage()
            const storageRef = ref(storage, "users/" + auth.currentUser.uid + "/profile.png")
            const [file] = imageSelector.files
            await uploadBytes(storageRef, file).then((snapshot) => {
                console.log('upload success')
            })

            //ユーザーデータのアップロード
            const userRef = collection(db, "users")
            await setDoc(doc(userRef, auth.currentUser.uid), {
                uid: auth.currentUser.uid,
                name: name.value,
                favorite: favorite.value,
                part: part.value
            })
        }
    })
}
