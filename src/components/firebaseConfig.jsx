import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {initializeFirestore, persistentLocalCache } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "Your_Api_Key",
  authDomain: "final-project-8c053.firebaseapp.com",
  projectId: "final-project-8c053",
  storageBucket: "final-project-8c053.appspot.com",
  messagingSenderId: "881972436006",
  appId: "1:881972436006:web:c1df7ce089a267118edae7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = initializeFirestore(app, {
  localCache: persistentLocalCache() // Enable offline persistence
});

export { auth, db }; // Export the auth object for use in other files
