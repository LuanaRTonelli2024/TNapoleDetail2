//firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
//import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAtPL-7P11plcUp_Q2q1MFVP0bksat3lCM",
  authDomain: "tnapoledetail2.firebaseapp.com",
  projectId: "tnapoledetail2",
  storageBucket: "tnapoledetail2.appspot.com",
  messagingSenderId: "647577311373",
  appId: "1:647577311373:web:850e3ba7cbcd791cf26ac4",
  measurementId: "G-WVTCC061QP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
//const firestore = getFirestore(app);
const database = getDatabase(app);

export { auth, database };