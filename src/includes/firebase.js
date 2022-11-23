import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC6rKnAMHAP1YMKQHWMSVyAILqYo_9u_8k',
  authDomain: 'music-2be5a.firebaseapp.com',
  projectId: 'music-2be5a',
  storageBucket: 'music-2be5a.appspot.com',
  messagingSenderId: '109938213369',
  appId: '1:109938213369:web:7f42e67a9b512e2144fd28',
};

/* // second music project in firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDHIsXkKrH68wvN0Ng71qw2gUsFlJwjG8o',
  authDomain: 'music-9b10e.firebaseapp.com',
  projectId: 'music-9b10e',
  storageBucket: 'music-9b10e.appspot.com',
  messagingSenderId: '902250120724',
  appId: '1:902250120724:web:dd918dd33c48863b95c901'
}; */

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
