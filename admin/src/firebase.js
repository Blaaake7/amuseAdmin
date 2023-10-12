// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage"
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD4E7d2oZztiHESDucUvt8HcflE8j7gUXE",
  authDomain: "amusetravel-386316.firebaseapp.com",
  projectId: "amusetravel-386316",
  storageBucket: "amusetravel-386316.appspot.com",
  messagingSenderId: "249976293201",
  appId: "1:249976293201:web:ddb32081464072a5b87570",
  measurementId: "G-S3L8PSRV57"
};

// Initialize Firebase
// const analytics = getAnalytics(app);
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const storage = getStorage()
export default app