// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA698vxM8lKIxCC-Zzh_fc7_o2ASXBwOVo",
  authDomain: "video-732a3.firebaseapp.com",
  projectId: "video-732a3",
  storageBucket: "video-732a3.firebasestorage.app",
  messagingSenderId: "346894405784",
  appId: "1:346894405784:web:2f0ae58cfd4f633b11c0ed"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export default app;



