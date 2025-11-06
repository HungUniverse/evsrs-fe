// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging } from "firebase/messaging";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZK9kR0_KVYt4GXG765GnDGVuMDUJmtQ4",
  authDomain: "evsrs-fe.firebaseapp.com",
  projectId: "evsrs-fe",
  storageBucket: "evsrs-fe.firebasestorage.app",
  messagingSenderId: "336922402305",
  appId: "1:336922402305:web:341b01db8a5324609a6a00",
  measurementId: "G-J5FQ5CQDQW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { app, analytics, messaging };
