import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdvek8oC5JG7CfC5QIeLBJsUv__7_x46M",
  authDomain: "auditready-database.firebaseapp.com",
  projectId: "auditready-database",
  storageBucket: "auditready-database.firebasestorage.app",
  messagingSenderId: "455678411065",
  appId: "1:455678411065:web:8f824621de4dda2b83e8e8",
  measurementId: "G-X458N36X80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 