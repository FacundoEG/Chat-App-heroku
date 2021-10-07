import firebase from "firebase";

const app = firebase.initializeApp({
  apiKey: "0lvv3QfJYRAX4H5TcjQmeU5KAJSDyY9M4MS1yiKY",
  authDomain: "apx-dwf-m6-c3fa7.firebaseapp.com",
  databaseURL: "https://apx-dwf-m6-c3fa7-default-rtdb.firebaseio.com",
});

const realtimeDB = firebase.database();

export { realtimeDB };
