import * as admin from "firebase-admin";
const serviceKey = require("./serviceKey.json"); 

admin.initializeApp({
  credential: admin.credential.cert(serviceKey as any),
  databaseURL: "https://apx-dwf-m6-c3fa7-default-rtdb.firebaseio.com",
});

const firestore = admin.firestore();
const realtimeDB = admin.database();

export { realtimeDB, firestore };
