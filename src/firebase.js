import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC2wBwn5jjhYwBw67-DYFCa-cWKq8rLwtM",

    authDomain: "dev-at-deakin-p4-fcf34.firebaseapp.com",

    projectId: "dev-at-deakin-p4-fcf34",

    storageBucket: "dev-at-deakin-p4-fcf34.firebasestorage.app",

    messagingSenderId: "867471060915",

    appId: "1:867471060915:web:0a4fdc6a727e81e38d65c6",

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);