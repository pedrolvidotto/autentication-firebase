import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import env from "react-dotenv";

const firebaseConfig = {
  apiKey: "AIzaSyDNCzmYYdElr32rPPGDcKs22_LfB4PqIA0",
  authDomain: "course-web-8e616.firebaseapp.com",
  projectId: "course-web-8e616",
  storageBucket: "course-web-8e616.appspot.com",
  messagingSenderId: "904598862954",
  appId: "1:904598862954:web:331b0cfc3c22013a13de13",
  measurementId: "G-28NQB4F7CY"
};
// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export {db}

