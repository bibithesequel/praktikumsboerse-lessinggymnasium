import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkvbc0whCn_3GzchRaC4aCC0HW6WV7lkc",
  authDomain: "lessing-praktikumboerse.firebaseapp.com",
  projectId: "lessing-praktikumboerse",
  storageBucket: "lessing-praktikumboerse.firebasestorage.app",
  messagingSenderId: "692679411494",
  appId: "1:692679411494:web:329e430bc7f53e2e08e3e7",
  measurementId: "G-NXNB1R1KZC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
