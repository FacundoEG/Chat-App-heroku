import { Router } from "@vaadin/router";
import { state } from "../state";

class Home extends HTMLElement {
  shadow: ShadowRoot;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
    // SE INICIALIZAN LOS ESTILOS DE LA PAGE
    var style = document.createElement("style");
    style.textContent = `
    .form{
       width: 100%;
       display: flex;
       flex-direction: column;
    } 
 
     .input-element,.select-element{
       border: 2px solid #000000;
       box-sizing: border-box;
       border-radius: 4px;  
       width: 100%;
       max-width: 353px;
       height: 55px;
       font-size: 20px;
       padding: 0px 8px;
       margin-bottom: 25px;
     }
 
     .input-title{
       display:block;
       font-size: 18px;
       font-family: Roboto;
       font-weight: 400;
     }
 
     .input-button{
       margin-top: 20px;
       background-color: #9CBBE9;
       width: 100%;
       max-width: 353px;
       border: none;
       box-sizing: border-box;
       border-radius: 4px;  
       height: 55px;
       font-size: 22px;
       font-family: Roboto;
       font-weight: 500;
     }

     .page-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 315px;
    }`;
    this.shadow.appendChild(style);
  }

  addListeners() {
    // LISTENER DEL EVENTO SUBMIT DEL FORM
    const form = this.shadow.querySelector(".form");
    form.addEventListener("submit", (e: any) => {
      e.preventDefault();

      // SE TOMAN LOS VALORES DE LOS INPUTS
      const name = e.target.nombre.value;
      const email = e.target.email.value;
      const roomSelect = e.target.select.value;

      // SI EL USUARIO DESEA CREAR UNA NUEVA ROOM:
      if (roomSelect == "newRoom") {
        //PRIMERO VERIFICA QUE ESTEN COMPLETADOS LOS CAMPOS DE NOMBRE E EMAIL
        if (email.trim() !== "" && name.trim() !== "") {
          // SE SETEA EL NOMBRE DEL NUEVO USER AL STATE
          state.setNombre(name);
          state.setEmail(email);

          const newRoomData = {
            email: email,
            name: name,
          };

          const newUserPromise = state.createNewUser(newRoomData);

          //SI EL MAIL INGRESADO YA EXISTE, ARROJA UNA ADVERTENCIA AL USUARIO
          newUserPromise.then((res) => {
            if (res.message) {
              alert(res.message);
            }

            // SI EL USUARIO SE CREA CORRECTAMENTE, SE CREA UNA NUEVA ROOM CON SU ID
            if (res.id) {
              const userId = {
                userId: res.id,
              };
              const newRoomPromise = state.createNewRoom(userId);
              const newUserId = res.id;

              // SI LA ROOM SE CREA CORRECTAMENTE, SE DEFINE EL ID EN EL STATE
              newRoomPromise.then((res) => {
                if (res.id) {
                  const newRoomId = res.id;
                  state.setRoomId(newRoomId);

                  // SE HACE UN GET PARA PODER ADQUIRIR EL ID LARGO DE LA ROOM
                  const getRoomPromise = state.connectToRoom(
                    newRoomId,
                    newUserId
                  );

                  getRoomPromise.then((res) => {
                    // UNA VEZ ADQUIRIDO EL ROOM ID LARGO, SE GUARDA EN EL STATE Y SE IMPORTA EL CHATROOM
                    state.setLongRoomId(res.rtdbRoomId);
                    state.importChatroom(res.rtdbRoomId);

                    // SE AVANZA AL CHAT
                    Router.go("/chat");
                  });
                }
              });
            }
          });
        } else {
          alert("Debes completar los campos de email y nombre.");
        }
      }

      // SI SE ELIGE LA OPCION DE INGRESAR A UNA ROOM EXISTENTE
      // SE DEBE AUTENTIFICAR EL EMAIL
      if (roomSelect == "actualRoom") {
        //PRIMERO VERIFICA QUE ESTEN COMPLETADOS LOS CAMPOS DE NOMBRE E EMAIL
        if (email.trim() !== "" && name.trim() !== "") {
          // SE SETEA EL NOMBRE DEL NUEVO USER AL STATE
          state.setNombre(name);
          state.setEmail(email);

          // SE TOMA EL INPUT DEL ROOM ID INGRESADO
          const roomIdInput = e.target.id.value;

          const emailData = {
            email: email,
          };

          // VERIFICA QUE EL USUARIO INGRESE UN EMAIL VALIDO
          const emailAuthPromise = state.getEmailAuth(emailData);
          emailAuthPromise.then((res) => {
            // SI EL EMAIL NO EXISTE, DEVUELVE UN MENSAJE DE ERROR
            if (res.message) {
              alert(res.message);
            }

            // SI EL EMAIL EXISTE, SE RECIBE EL USER ID
            if (res.id) {
              const userAuthId = res.id;
              state.setRoomId(roomIdInput);

              // SE HACE UN GET PARA PODER ADQUIRIR EL ID LARGO DE LA ROOM
              const getRoomPromise = state.connectToRoom(
                roomIdInput,
                userAuthId
              );

              getRoomPromise.then((res) => {
                // SI EXISTE UN ERROR SE LE AVISA AL USUARIO
                if (res.message) {
                  alert(res.message);
                }

                // AL OBTENER EL ID LARGO, SE AGREGA AL STATE Y SE DEFINE EL STATE
                if (res.rtdbRoomId) {
                  state.setLongRoomId(res.rtdbRoomId);
                  state.importChatroom(res.rtdbRoomId);
                  Router.go("/chat");
                }
              });
            }
          });
        } else {
          alert("Debes completar los campos de email y nombre.");
        }
      }
    });

    // LISTENER PARA QUE SE AGREGE LA OPCION DE PONER EL ID CUANDO ES UN ROOM EXISTENTE
    const roomSelect = this.shadowRoot.querySelector(".select-element");

    // SE ESCUCHA EL EVENTO CHANGE
    roomSelect.addEventListener("change", (event: any) => {
      let selection = event.target.value;
      const idContainer = this.shadowRoot.querySelector(".id-container");

      // SI SE ELIGE UNA NUEVA SALA, SE BORRA EL ID CONTAINER
      if (selection == "newRoom") {
        idContainer.innerHTML = "";
      }

      // SI SE ELIGE UNA SALA EXISTENTE, SE AGREGA EL ID CONTAINER
      if (selection == "actualRoom") {
        idContainer.innerHTML = `
        <span class="input-title">Room Id</span>
        <input class="input-element" type="text" name="id">`;
      }
    });
  }

  // SE CREA EL CONNECTED CALLBACK
  connectedCallback() {
    // RENDERIZA LA PAGE
    this.render();
  }
  render() {
    //SE CREA EL DIV DONDE SE ALOJARA LA PAGE
    const pageDiv = document.createElement("div");
    pageDiv.classList.add("page-container");

    //SE RENDERIZA
    pageDiv.innerHTML = `
    <custom-title>Bienvenidx</custom-title>
    <form class="form">
    <span class="input-title">Email</span>
    <input class="input-element" type="email" name="email">

    <span class="input-title">Tu Nombre</span>
    <input class="input-element" type="text" name="nombre">

    <span class="input-title">Room</span>
    <select class="select-element" type="text" name="select">
    <option class="new" value="newRoom">Nueva Room</option>
    <option class="actual" value="actualRoom">Room Existente</option>
    </select>

    <div class="id-container"></div>

    <button class="input-button">Comenzar</button>
    </form>
    `;

    this.shadow.appendChild(pageDiv);

    // SE AGREGAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("home-page", Home);
