// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAVtpcsxIH9_IYgIxz8BaLu1HnZGxFDEpM",
    authDomain: "nomad-nest-firebase.firebaseapp.com",
    projectId: "nomad-nest-firebase",
    storageBucket: "nomad-nest-firebase.firebasestorage.app",
    messagingSenderId: "72159673447",
    appId: "1:72159673447:web:84b58d614422d0e073e8c2",
    databaseURL: "https://cors-anywhere.herokuapp.com/https://nomad-nest-firebase-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, provider, db, storage };

console.log(db, "db", storage, "storage")
