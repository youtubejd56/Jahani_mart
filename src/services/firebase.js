import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAbkYte12DUjGpH3xzrtToiud3tmxe1YXw",
  authDomain: "jahani-mart.firebaseapp.com",
  projectId: "jahani-mart",
  storageBucket: "jahani-mart.firebasestorage.app",
  messagingSenderId: "351589110436",
  appId: "1:351589110436:web:0939dff587162e77064c31",
  measurementId: "G-57JKF6NXEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
