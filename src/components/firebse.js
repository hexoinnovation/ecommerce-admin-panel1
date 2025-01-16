// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth,onAuthStateChanged,signOut } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJVykXMskt9hXmmjQro11B1UVJseQkTvw",
  authDomain: "shopo-6234e.firebaseapp.com",
  projectId: "shopo-6234e",
  storageBucket: "shopo-6234e.firebasestorage.app",
  messagingSenderId: "1063188297789",
  appId: "1:1063188297789:web:0c1cac3806de4c5af05254",
  measurementId: "G-ME5S1LKN6T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
 const auth = getAuth(app);
export { db ,app,analytics,auth,onAuthStateChanged,signOut};