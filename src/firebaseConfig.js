// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from  "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDz3gwBoj09j0p_qhlCqyXfKCS4nE8gUwE",
  authDomain: "vue-pos-2cd7c.firebaseapp.com",
  projectId: "vue-pos-2cd7c",
  storageBucket: "vue-pos-2cd7c.appspot.com",
  messagingSenderId: "333963503493",
  appId: "1:333963503493:web:21733cc034d6db3d2ac6ec"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {  db };