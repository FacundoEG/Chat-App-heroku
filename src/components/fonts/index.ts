class LargeFont extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .large{
      margin: 0;
      font-size: 22px;
      font-family: Roboto;
      font-weight: 500;
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("h3");
    text.classList.add("large");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("custom-large", LargeFont);

class Title extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .title{
      margin: 0;
      font-size: 52px;
      font-family: Roboto;
      font-weight: bold;
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("h1");
    text.classList.add("title");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("custom-title", Title);

class Subtitle extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .subtitle{
      margin: 0;
      font-size: 38px;
      font-family: Roboto;
      font-weight: bold;
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("h2");
    text.classList.add("subtitle");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}
customElements.define("custom-subtitle", Subtitle);

class Body extends HTMLElement {
  constructor() {
    super();
    this.render();
  }
  render() {
    var style = document.createElement("style");
    style.textContent = `
    .body{
      margin: 0;
      font-size: 18px;
      font-family: Roboto;
      font-weight: 400;
      padding: 10px 0px;
    }
    `;
    var shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(style);
    var text = document.createElement("p");
    text.classList.add("body");
    text.textContent = this.textContent;
    shadow.appendChild(text);
  }
}

customElements.define("custom-body", Body);
