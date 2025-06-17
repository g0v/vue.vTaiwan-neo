// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCQM2Tz3xGGmLcjQsKkEKTPEaot2yqVzM4",
    authDomain: "vtaiwan-8160b.firebaseapp.com",
    databaseURL: "https://vtaiwan-8160b-default-rtdb.firebaseio.com",
    projectId: "vtaiwan-8160b",
    storageBucket: "vtaiwan-8160b.firebasestorage.app",
    messagingSenderId: "1090593078456",
    appId: "1:1090593078456:web:1cedfa627491832306484d",
    measurementId: "G-2GBP8JEJ8M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export const blogsRef = ref(database, "blogs");
export const usersRef = ref(database, "users");
export const meetingsRef = ref(database, "meetings");

export default app;
