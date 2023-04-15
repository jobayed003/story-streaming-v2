// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCptCwdOzdgBvgU1O6UIOB_Z1ipsMUKCtg',
  authDomain: 'story-streaming-84a2e.firebaseapp.com',
  projectId: 'story-streaming-84a2e',
  storageBucket: 'story-streaming-84a2e.appspot.com',
  messagingSenderId: '811772781410',
  appId: '1:811772781410:web:95ace7c3fc9dae9200823b',
  measurementId: 'G-7L14LF1YGG',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
