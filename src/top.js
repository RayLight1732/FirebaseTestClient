import { getAuth, signOut } from "firebase/auth";
import firebaseApp from "./initialize"

const auth = getAuth()
auth.onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = 'http://localhost:3000'
    }
})

const button = document.getElementById('mypage')
button.addEventListener('click', () => {
    window.location.href = 'http://localhost:3000/mypage'
})
const button2 = document.getElementById('logout')
button2.addEventListener('click', async () => {
    try {
        await signOut(auth)
    } catch (e) {
        if (e instanceof FirebaseError) {
            console.log(e)
        }
    }
})
const button3 = document.getElementById('upload')
button3.addEventListener('click',() => {
    window.location.href = 'http://localhost:3000/upload'
})
