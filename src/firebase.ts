import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUVQSFsNfgaHCUVwDQLG4vqMMzrdgj-ao",
  authDomain: "pro-flame-tj1d7.firebaseapp.com",
  projectId: "pro-flame-tj1d7",
  storageBucket: "pro-flame-tj1d7.firebasestorage.app",
  messagingSenderId: "562525171414",
  appId: "1:562525171414:web:3679f4c7bfed3fa1662377"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication
export const auth = getAuth(app);

// Initialize Firestore targeting our custom database ID
export const db = getFirestore(app, "ai-studio-a255e1c2-6c57-4ed6-b190-b53056cb2776");
