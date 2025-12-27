import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

/* =========================================================
   FIREBASE CONFIGURATION
   To enable Real SMS OTP, you must replace these values
   with your own from the Firebase Console:
   https://console.firebase.google.com/
   ========================================================= */

const firebaseConfig = {
    apiKey: "AIzaSyAGsH3rT5g7wVFpYuWyNLxtVD7_YhN6i6Y",
    authDomain: "ma-am-project.firebaseapp.com",
    projectId: "ma-am-project",
    storageBucket: "ma-am-project.firebasestorage.app",
    messagingSenderId: "171006279208",
    appId: "1:171006279208:web:2034aa379be1a7e14f7f1d",
    measurementId: "G-LQENJP43NK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
