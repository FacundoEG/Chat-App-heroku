import { state } from "../state";

type Message = {
  from: string;
  text: string;
};

class ChatPage extends HTMLElement {
  shadow: ShadowRoot;
  messages: Message[] = [];
  constructor() {
    super();
    // SE AGREGAN LOS ESTILOS A LA PAGE
    this.shadow = this.attachShadow({ mode: "open" });
    var style = document.createElement("style");
    style.textContent = `
    .input-container{
       width: 100%;
    } 
 
     .input-element{
       border: 2px solid #000000;
       box-sizing: border-box;
       border-radius: 4px;  
       width: 100%;
       max-width: 353px;
       height: 55px;
       font-size: 20px;
       padding: 0px 10px;
     }
 
     .input-name-label{
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

     .page-container{
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 315px;
    }

    .chat-container {
      height: 320px;
      border: black 0.5px solid;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 10px 10px;
      overflow: auto;
    }
    
    .chat-container::-webkit-scrollbar {
      width: 12px;
    }
    
    .chat-container::-webkit-scrollbar-track {
      background: #d8d8d8;
    }
    
    .chat-container::-webkit-scrollbar-thumb {
      background-color: #9cbbe9;
      border-radius: 20px;
      border: 3px solid #d8d8d8;
    }
    `;
    this.shadow.appendChild(style);
  }
  // SE ENGANCHA EL CONNECTED CALLBACK
  connectedCallback() {
    state.subscribe(() => {
      // CADA VEZ QUE EL STATE CAMBIE, AGREGA LOS MENSAJES NUEVOS A THIS.MESSAGES
      const currentState = state.getState();
      this.messages = currentState.messages;
      // BORRA EL CHATROOM ANTERIOR Y RENDERIZA UNO NUEVO
      this.shadow.lastChild.remove();
      this.render();
    });
    // SE TRAEN LOS MENSAJES DEL STATE Y SE RENDERIZA LA PAGE
    const currentState = state.getState();
    this.messages = currentState.messages;
    this.render();
  }

  // SE AGREGAN LOS LISTENERS PARA ESCUCHAR EL SUBMIT DEL FORM PARA ENVIAR MENSAJES
  addListeners() {
    const form = this.shadow.querySelector(".submit-message");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      let newMessage = target["new-message"].value;

      if (newMessage.trim() !== "") {
        // SE AGREGAN LOS NUEVOS MENSAJES A LA RTDB
        state.pushNewMessage(newMessage);
      } else {
        alert(
          "Lo siento, pero no puedes enviar mensajes vacíos. Vuelve a intentarlo otra vez."
        );
      }
    });
  }

  render() {
    // SE CREA EL DIV CHATPAGE
    const chatPage = document.createElement("div");
    chatPage.classList.add("page-container");

    const currentState = state.getState();

    chatPage.innerHTML = `
    <custom-title>Chat</custom-title>
    <custom-subtitle>Room id: ${currentState.roomId}</custom-subtitle>
     <div class="chat"></div>
     <form class="submit-message">
      <input class="input-element" type="text" name="new-message">
      <button class="input-button">Enviar</button>
     </form>
    `;

    // SE HACE UNA REFERENCIA A LA CHAT SECTION Y SE LE DA SU CLASE
    var chatSection = chatPage.querySelector(".chat");
    chatSection.classList.add("chat-container");

    // LA FUNCION CREATECHATBUBBLES IMPORTA LOS MESSAGES DESDE THIS.MESSAGES
    // Y LOS AGREGA AL CHAT CONTAINER
    function createChatBubbles(messages: Message[]) {
      // ITERA TODOS LOS MENSAJES DE LOS PARAMETROS
      for (const message of messages) {
        const currentState = state.getState();

        // SE CREAN LOS CONTENEDORES DE LAS BUBBLES
        const bubble = document.createElement("div");

        // SI EL FROM DEL MESSAGE ES IGUAL AL NOMBRE DEL STATE, SE CREA UNA USER-BUBBLE
        if (message.from === currentState.nombre) {
          bubble.innerHTML = `
          <user-bubble text="${message.text}" username="${message.from}"></user-bubble>`;
          chatSection.appendChild(bubble);
        }

        // SI EL FROM DEL MESSAGE ES DIFERENTE AL NOMBRE DEL STATE, SE CREA UNA OTHER-BUBBLE
        if (message.from !== currentState.nombre) {
          bubble.innerHTML = `
          <gray-bubble text="${message.text}" username="${message.from}"></user-bubble>`;
          chatSection.appendChild(bubble);
        }
      }
    }

    // SE CREAN LAS BURBUJAS
    createChatBubbles(this.messages);

    // SE AGREGAN AL SHADOW
    this.shadow.appendChild(chatPage);

    // SE ASIGNA UN SCROLL AUTOMATICO PARA LLEGAR AL ULTIMO MENSAJE
    chatSection.scrollTo({
      top: 1000,
      left: 0,
      behavior: "auto",
    });

    // SE ACTUALIZAN LOS LISTENERS
    this.addListeners();
  }
}
customElements.define("chat-page", ChatPage);
