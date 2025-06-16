// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASuUTQ3UaFsNZbgbo5YrIt5_hZkcFBBwA",
  authDomain: "cls-garment.firebaseapp.com",
  projectId: "cls-garment",
  storageBucket: "cls-garment.appspot.com",
  messagingSenderId: "506338311914",
  appId: "1:506338311914:web:6e75b8db2456d0daa26193",
  measurementId: "G-VM6PXX7Z5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);       // untuk simpan data form

export { db };