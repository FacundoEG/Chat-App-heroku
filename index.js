"use strict";
exports.__esModule = true;
var database_1 = require("./database");
var cors = require("cors");
var express = require("express");
var nanoid_1 = require("nanoid");
var port = process.env.PORT || 3000;
//API INIT AND CONFIG
var app = express();
app.use(express.json());
app.use(cors());
var userCollectionRef = database_1.firestore.collection("users");
var roomsCollectionRef = database_1.firestore.collection("rooms");
// ENDPOINTS
app.get("/env", function (req, res) {
    res.json({
        environment: "hola soy facu que onda pez"
    });
});
// SIGNUP
app.post("/signup", function (req, res) {
    var userEmail = req.body.email;
    var userName = req.body.name;
    userCollectionRef
        .where("email", "==", userEmail)
        .get()
        .then(function (searchResponse) {
        // VERIFICA QUE NO HAYA UN DOC CON EL EMAIL IGUAL AL USER EMAIL
        if (searchResponse.empty) {
            userCollectionRef
                .add({ email: userEmail, name: userName })
                .then(function (newUserRef) {
                // DEVUELVE UN OBJETO CON EL ID DEL NUEVO USUSARIO CORRESPONDIENTE
                res.status(200).json({
                    id: newUserRef.id,
                    "new": true
                });
            });
        }
        else {
            // SI EL EMAIL YA ESTABA REGRISTRADO EN UN USER, DEVUELVE EL ID DEL USUARIO CORRESPONDIENTE
            res.status(400).json({
                message: "El email que ingresaste ya corresponde a un usuario registrado."
            });
        }
    });
});
// AUTHENTICATION
app.post("/auth", function (req, res) {
    var email = req.body.email;
    userCollectionRef
        .where("email", "==", email)
        .get()
        .then(function (searchResponse) {
        // VERIFICA QUE EL EMAIL DEL USER EXISTA EN ALGUN DOC
        if (searchResponse.empty) {
            res.status(404).json({
                message: "El email que ingresaste no corresponde a un usuario registrado."
            });
        }
        else {
            //DEVUELVE EL ID DEL USER IDENTIFICADO
            res.status(200).json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
// CREA UN NUEVO ROOM
app.post("/rooms", function (req, res) {
    var userId = req.body.userId;
    userCollectionRef
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        // VERIFICA QUE EL USUARIO EXISTA EN FIRESTORE USANDO EL ID
        // DE SER ASÍ, CREA UNA NUEVA ROOM CON UN ID
        if (doc.exists) {
            // CREAMOS LA REFERENCIA DEL NUEVO ROOM
            var newRoomRef_1 = database_1.realtimeDB.ref("rooms/" + (0, nanoid_1.nanoid)());
            // STEAMOS EL OWNER COMO EL USER QUE INGRESO EL BODY
            newRoomRef_1
                .set({
                owner: userId
            })
                .then(function () {
                // GUARDA EL ID LARGO Y CREA UN ID CORTO PARA GUARDAR EN FIRESTORE
                var roomLongId = newRoomRef_1.key;
                var roomId = 1000 + Math.floor(Math.random() * 999);
                // CREA UN NUEVO DOCUMENTO EN LA COLLECTION ROOMS DE FIRESTORE CON EL ID LARGO DENTRO
                roomsCollectionRef
                    .doc(roomId.toString())
                    .set({
                    rtdbRoomId: roomLongId
                })
                    // DEVUELVE EL ID CORTO
                    .then(function () {
                    res.json({
                        id: roomId.toString()
                    });
                });
            });
        }
        else {
            // SI NO EXISTE, DEVUELVE UN ERROR 401
            res.status(401).json({
                message: "El id del usuario no existe."
            });
        }
    });
});
// CONECTA AL USER CON UN ROOM EXISTENTE
app.get("/rooms/:roomId", function (req, res) {
    var userId = req.query.userId;
    var roomId = req.params.roomId;
    // REVISA SI EL USER ID CORRESPONDE A ALGUN USUARIO DE USERS EN FIRESTORE
    userCollectionRef
        .doc(userId.toString())
        .get()
        .then(function (doc) {
        // SI EXISTE, VA A BUSCAR EL ROOM ID LARGO DENTRO DE FIRESTORE, USANDO EL ID CORTO
        if (doc.exists) {
            roomsCollectionRef
                .doc(roomId)
                .get()
                .then(function (snap) {
                // VERIFICA QUE EL ROOM EXISTA
                if (snap.exists) {
                    // TERMINA DEVOLVIENDO EL ID LARGO QUE CORRESPONDE AL ROOM
                    var data = snap.data();
                    res.json(data);
                }
                else {
                    // SI NO EXISTE, DEVUELVE UN ERROR 401
                    res.status(401).json({
                        message: "El room indicado no existe."
                    });
                }
            });
        }
        else {
            // SI NO EXISTE, DEVUELVE UN ERROR 401
            res.status(401).json({
                message: "El id del usuario no existe."
            });
        }
    });
});
app.post("/rooms/:id", function (req, res) {
    var chatRoomRef = database_1.realtimeDB.ref("/rooms/" + req.params.id + "/messages");
    chatRoomRef.on("value", function (snap) {
        var value = snap.val();
    });
    chatRoomRef.push(req.body, function () {
        res.json("todo ok");
    });
});
//API LISTEN
app.listen(port, function () {
    console.log("Estamos conectados al puerto: " + port);
});
