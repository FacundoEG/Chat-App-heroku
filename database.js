import * as admin from "firebase-admin";
import * as serviceAccount from "./key.json";
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://apx-dwf-m6-c3fa7-default-rtdb.firebaseio.com",
});
const firestore = admin.firestore();
const realtimeDB = admin.database();
export { realtimeDB, firestore };
