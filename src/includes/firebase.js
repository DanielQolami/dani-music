import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGE_SENDER_ID,
  appId: process.env.VUE_APP_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// For offline Caching
enableIndexedDbPersistence(db).catch((error) => {
  console.log(`Firebase persistence error ${error.code}`);
  if (error.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
  } else if (error.code === 'unimplemented') {
    console.log('The current browser does not support all of the features required to enable persistence');
  }
});

const usersCollection = collection(db, 'users');
const songsCollection = collection(db, 'songs');
const commentsCollection = collection(db, 'comments');

export {
  auth, db, usersCollection, songsCollection, commentsCollection, storage,
};
