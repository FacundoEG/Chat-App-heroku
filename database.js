"use strict";
exports.__esModule = true;
exports.firestore = exports.realtimeDB = void 0;
var admin = require("firebase-admin");
var serviceKey = require("./serviceKey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceKey),
    databaseURL: "https://apx-dwf-m6-c3fa7-default-rtdb.firebaseio.com"
});
var firestore = admin.firestore();
exports.firestore = firestore;
var realtimeDB = admin.database();
exports.realtimeDB = realtimeDB;
