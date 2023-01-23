customElements.define("song-line", class extends HTMLElement {
    connectedCallback() {
        console.log(this.nodeName,this.children);
    }
});