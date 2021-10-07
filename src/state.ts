import { realtimeDB } from "./rtbs";
import { Router } from "@vaadin/router";

const API_BASE_URL = "https://chat-app-rooms-heroku.herokuapp.com";

type Message = {
  from: string;
  message: string;
};

const state = {
  data: {
    nombre: null,
    roomId: null,
    roomIdLong: null,
    email: null,
    messages: [],
  },
  listeners: [],

  getState() {
    return this.data;
  },

  getStateUserName() {
    return this.nombre;
  },

  getStateRoomId() {
    return this.roomid;
  },

  getStateEmail() {
    return this.email;
  },

  // SETEA EL NOMBRE EN EL STATE
  setNombre(nombre: string) {
    const currentState = this.getState();
    currentState.nombre = nombre;
    this.setState(currentState);
  },

  // SETEA EL ROOMID CORTO EN EL STATE
  setRoomId(roomId: string) {
    const currentState = this.getState();
    currentState.roomId = roomId;
    this.setState(currentState);
  },

  // SETEA EL ROOMID LARGO EN EL STATE
  setLongRoomId(roomId: string) {
    const currentState = this.getState();
    currentState.roomIdLong = roomId;
    this.setState(currentState);
  },

  // SETEA EL EMAIL EN EL STATE
  setEmail(email: string) {
    const currentState = this.getState();
    currentState.email = email;
    this.setState(currentState);
  },

  // SI NO HAY NOMBRE O EMAIL EN EL STATE, VUELVE A LA HOME PAGE
  init() {
    const currentState = this.getState();
    if (currentState.nombre == null || currentState.email == null) {
      Router.go("/");
    }
  },

  // IMPORTA LOS MENSAJES DEL CHATROOM Y LOS AGREGA AL STATE
  importChatroom(roomId) {
    const currentState = this.getState();
    const chatroomRef = realtimeDB.ref("/rooms/" + roomId);
    chatroomRef.on("value", (snapshot) => {
      const messagesFromServer = snapshot.val();
      // SOLO AGREGA LOS MENSAJES SI EL ROOM LOS TIENE
      if (messagesFromServer.messages !== undefined) {
        const messagesArray = Object.values(messagesFromServer.messages);
        currentState.messages = messagesArray;
        this.setState(currentState);
      }
    });
  },

  // INGRESA EL EMAIL DEL USUARIO Y RECIBE SU USER ID
  getEmailAuth(email) {
    return fetch(API_BASE_URL + "/auth", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(email),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // CREA UNA NUEVA ROOM PONIENDOLO AL USUARIO COMO OWNER
  createNewRoom(userId) {
    return fetch(API_BASE_URL + "/rooms", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(userId),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // CREA UN NUEVO USUARIO Y DEVUELVE SU ID
  createNewUser(newUserDataData) {
    return fetch(API_BASE_URL + "/signup", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(newUserDataData),
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // DEVUELVE EL ID LARGO DE LA SALA CUANDO LE PASAS EL ID CORTO Y EL NOMBRE DE USUARIO
  connectToRoom(roomId, userId) {
    return fetch(API_BASE_URL + "/rooms/" + roomId + "?userId=" + userId, {
      method: "get",
    })
      .then((res) => {
        return res.json();
      })
      .then((finalres) => {
        return finalres;
      });
  },

  // AGREGA UN NUEVO MENSAJE A LA SALA DE CHATROOM
  pushNewMessage(message: string) {
    const currentState = this.getState();

    // TOMA EL NOMBRE Y EL ROOMID
    const roomId = currentState.roomIdLong;
    const nameFromState = this.data.nombre;

    fetch(API_BASE_URL + "/rooms/" + roomId, {
      headers: { "content-type": "application/json" },
      method: "post",
      body: JSON.stringify({
        from: nameFromState,
        text: message,
      }),
    });
  },

  setState(newState) {
    this.data = newState;
    console.log("El nuevo estado es:", newState);
    for (const callback of this.listeners) {
      callback();
    }
  },

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },
};

export { state };
