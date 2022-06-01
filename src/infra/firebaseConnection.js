import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import env from "react-dotenv";

const firebaseConfig = {
  apiKey: env.API_KEY,
  authDomain: env.AUTH_DOMAIN,
  projectId: env.PROJECT_ID,
  storageBucket: env.STORAGE_BUCKET,
  messagingSenderId: env.MESSAGIN_SENDER_ID,
  appId: env.APP_ID,
  measurementId: env.MEASUREMENT_ID
};
// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export {db}

