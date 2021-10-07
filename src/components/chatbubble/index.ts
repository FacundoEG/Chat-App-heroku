class UserMessage extends HTMLElement {
  user: string;
  message: string;
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .bubble{
      width: max-content;
      max-width: 250px;
      background-color: #B9E97C;
      border: none;
      box-sizing: border-box;
      border-radius: 5px;
      padding: 10px;
      display: flex;
      margin: 0 0 auto auto;
    }

    .message-text{
      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      color: black;
      text-align: right;
    }
    
    .username{
      display: block;
      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 13px;
      color: #A5A5A5;
      text-align: right;
      }
    `;

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);

    const text = this.getAttribute("text");
    const username = this.getAttribute("username");

    const div = document.createElement("div");

    div.innerHTML = `
    <label class="username">${username}</label>
    <div class="bubble"><span class="message-text">${text}</span></div>
    `;

    shadow.appendChild(div);
  }
}
customElements.define("user-bubble", UserMessage);

class OtherMessage extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .bubble{
      width: max-content;
      max-width: 250px;
      background-color: #D8D8D8;
      border: none;
      box-sizing: border-box;
      border-radius: 5px;
      padding: 10px;
      display: flex;
      margin: 0 auto auto 0;
    }

    .message-text{
      font-family: Roboto;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      color: black;
      text-align: left;
    }

    .username{
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 13px;
    color: #A5A5A5;
    }
    `;

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);

    const div = document.createElement("div");

    const text = this.getAttribute("text");
    const username = this.getAttribute("username");

    div.innerHTML = `
    <label class="username">${username}</label>
    <div class="bubble"><span class="message-text">${text}</span></div>
    `;

    shadow.appendChild(div);
  }
}
customElements.define("gray-bubble", OtherMessage);
