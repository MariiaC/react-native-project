

import { initializeApp, getReactNativePersistence } from 'firebase/app';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getStorage } from "firebase/storage";


// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwXDlKY8hLa8Ux0z6wipNwZK7nbld3zxw",
  authDomain: "rn-myproject-327ab.firebaseapp.com",
  projectId: "rn-myproject-327ab",
  storageBucket: "rn-myproject-327ab.appspot.com",
  messagingSenderId: "123745599775",
  appId: "1:123745599775:web:2b893b73790f3397f2b02a",
  measurementId: "G-KSCLGR83QN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);



 

export default firebase.initializeApp(firebaseConfig);
