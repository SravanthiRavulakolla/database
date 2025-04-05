// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getAuth } = require("firebase/auth");

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJ0E6QGZubGS-o_qPG2rhesICDpe17EyE",
  authDomain: "sugar-7f68a.firebaseapp.com",
  projectId: "sugar-7f68a",
  storageBucket: "sugar-7f68a.firebasestorage.app",
  messagingSenderId: "52365422040",
  appId: "1:52365422040:web:2acd0cc191f796946c56ad",
  measurementId: "G-Z4J145YYEZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

module.exports = { app, db, auth }; 