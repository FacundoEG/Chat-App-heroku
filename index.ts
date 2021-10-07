import { realtimeDB, firestore } from "./database";
import * as cors from "cors";
import * as express from "express";
import { nanoid } from "nanoid";

const port = process.env.PORT || 3000

//API INIT AND CONFIG
const app = express();
app.use(express.json());
app.use(cors());

const userCollectionRef = firestore.collection("users");
const roomsCollectionRef = firestore.collection("rooms");

// ENDPOINTS

app.get("/env",(req,res)=>{
  res.json({
    environment: "hola soy facu"
  })
})

// SIGNUP
app.post("/signup", (req, res) => {
  const userEmail = req.body.email;
  const userName = req.body.name;

  userCollectionRef
    .where("email", "==", userEmail)
    .get()
    .then((searchResponse) => {
      // VERIFICA QUE NO HAYA UN DOC CON EL EMAIL IGUAL AL USER EMAIL
      if (searchResponse.empty) {
        userCollectionRef
          .add({ email: userEmail, name: userName })
          .then((newUserRef) => {
            // DEVUELVE UN OBJETO CON EL ID DEL NUEVO USUSARIO CORRESPONDIENTE
            res.status(200).json({
              id: newUserRef.id,
              new: true,
            });
          });
      } else {
        // SI EL EMAIL YA ESTABA REGRISTRADO EN UN USER, DEVUELVE EL ID DEL USUARIO CORRESPONDIENTE
        res.status(400).json({
          message:
            "El email que ingresaste ya corresponde a un usuario registrado.",
        });
      }
    });
});

// AUTHENTICATION
app.post("/auth", (req, res) => {
  const { email } = req.body;
  userCollectionRef
    .where("email", "==", email)
    .get()
    .then((searchResponse) => {
      // VERIFICA QUE EL EMAIL DEL USER EXISTA EN ALGUN DOC
      if (searchResponse.empty) {
        res.status(404).json({
          message:
            "El email que ingresaste no corresponde a un usuario registrado.",
        });
      } else {
        //DEVUELVE EL ID DEL USER IDENTIFICADO
        res.status(200).json({
          id: searchResponse.docs[0].id,
        });
      }
    });
});

// CREA UN NUEVO ROOM
app.post("/rooms", (req, res) => {
  const { userId } = req.body;
  userCollectionRef
    .doc(userId.toString())
    .get()
    .then((doc) => {
      // VERIFICA QUE EL USUARIO EXISTA EN FIRESTORE USANDO EL ID
      // DE SER ASÍ, CREA UNA NUEVA ROOM CON UN ID
      if (doc.exists) {
        // CREAMOS LA REFERENCIA DEL NUEVO ROOM
        const newRoomRef = realtimeDB.ref("rooms/" + nanoid());
        // STEAMOS EL OWNER COMO EL USER QUE INGRESO EL BODY
        newRoomRef
          .set({
            owner: userId,
          })
          .then(() => {
            // GUARDA EL ID LARGO Y CREA UN ID CORTO PARA GUARDAR EN FIRESTORE
            const roomLongId = newRoomRef.key;
            const roomId = 1000 + Math.floor(Math.random() * 999);

            // CREA UN NUEVO DOCUMENTO EN LA COLLECTION ROOMS DE FIRESTORE CON EL ID LARGO DENTRO
            roomsCollectionRef
              .doc(roomId.toString())
              .set({
                rtdbRoomId: roomLongId,
              })
              // DEVUELVE EL ID CORTO
              .then(() => {
                res.json({
                  id: roomId.toString(),
                });
              });
          });
      } else {
        // SI NO EXISTE, DEVUELVE UN ERROR 401
        res.status(401).json({
          message: "El id del usuario no existe.",
        });
      }
    });
});

// CONECTA AL USER CON UN ROOM EXISTENTE
app.get("/rooms/:roomId", (req, res) => {
  const { userId } = req.query;
  const { roomId } = req.params;
  // REVISA SI EL USER ID CORRESPONDE A ALGUN USUARIO DE USERS EN FIRESTORE
  userCollectionRef
    .doc(userId.toString())
    .get()
    .then((doc) => {
      // SI EXISTE, VA A BUSCAR EL ROOM ID LARGO DENTRO DE FIRESTORE, USANDO EL ID CORTO
      if (doc.exists) {
        roomsCollectionRef
          .doc(roomId)
          .get()
          .then((snap) => {
            // VERIFICA QUE EL ROOM EXISTA
            if (snap.exists) {
              // TERMINA DEVOLVIENDO EL ID LARGO QUE CORRESPONDE AL ROOM
              const data = snap.data();
              res.json(data);
            } else {
              // SI NO EXISTE, DEVUELVE UN ERROR 401
              res.status(401).json({
                message: "El room indicado no existe.",
              });
            }
          });
      } else {
        // SI NO EXISTE, DEVUELVE UN ERROR 401
        res.status(401).json({
          message: "El id del usuario no existe.",
        });
      }
    });
});

app.post("/rooms/:id", function (req, res) {
  const chatRoomRef = realtimeDB.ref("/rooms/" + req.params.id + "/messages");
  chatRoomRef.on("value", (snap) => {
    let value = snap.val();
  });
  chatRoomRef.push(req.body, function () {
    res.json("todo ok");
  });
});

//API LISTEN
app.listen(port, () => {
  console.log(`Estamos conectados al puerto: ${port}`);
});
