 class Header extends HTMLElement {
  constructor() {
    super();
    this.render()
  }
  render(){
    var style = document.createElement("style")
    style.textContent = `
    .header{
      width: 100%;
      height: 60px;
      background-color: #FF8282;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    @media (min-width: 600px) {
      .header{
        height: 80px
      }
    }
    `
    var shadow = this.attachShadow({mode: 'open'});
    shadow.appendChild(style)
    
    var div = document.createElement("div")
    div.classList.add("header")

    shadow.appendChild(div)
    for (const children of this.children) {
      div.appendChild(children)
    }

  }
}
customElements.define('custom-header', Header);
