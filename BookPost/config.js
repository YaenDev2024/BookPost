// Import the functions you need from the SDKs you need
import {initializeApp} from '@firebase/app';
import {getFirestore} from '@firebase/firestore';
import {getAuth} from '@firebase/auth';
import {initializeAuth, getReactNativePersistence} from '@firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAGRCl-zPp1cVQcule8VCrCtMMSUUZxpls",
    authDomain: "bookpost-5011d.firebaseapp.com",
    projectId: "bookpost-5011d",
    storageBucket: "bookpost-5011d.appspot.com",
    messagingSenderId: "1053874147245",
    appId: "1:1053874147245:web:96219e8453781f95ba9b24",
    measurementId: "G-Z5HHZXP73H"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
