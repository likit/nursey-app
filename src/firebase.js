import Firebase from './firebase'

const firebaseApp = Firebase.initializeApp();

const st = firebaseApp.storage('gs://nursey-cd88a.appspot.com/');
const fs = firebaseApp.firestore();