// create a Web Component
// <song-pause duration="1000" at="1000"></song-pause>
customElements.define(
  "song-pause",
  class extends HTMLElement {
    // ================================================================= constructor
    constructor() {
      // create a shadow root so each SVG circle has its own CSS
      super().attachShadow({ mode: "open" });
    }
    // ================================================================= getters
    get song() {
      return this.closest("song-text");
    }
    get audio() {
      return this.song.querySelector("audio");
    }
    get songline() {
      return this.closest("song-line");
    }
    get duration() {
      return this.getAttributeSeconds("duration");
    }
    get time() {
      return this.getAttributeSeconds("at");
    }
    get starttime() {
      return this.time - this.duration;
    }
    get paststarttime() {
      return this.audio.currentTime > this.starttime
    }
    get circle() {
      return this.shadowRoot.querySelector("#counter");
    }
    // ================================================================= playstate
    get playstate() {
      return this.circle.style.animationPlayState;
    }
    set playstate(val) {
      this.circle.style.animationPlayState = val;
    }
    get isrunning() {
      return this.playstate == "running";
    }
    // ================================================================= play/pause
    getAttributeSeconds(name) {
      return (~~this.getAttribute(name) || 1000) / 1000;
    }
    // ================================================================= play/pause
    pause() {
      this.playstate = "paused";
    }
    play(at) {
      this.playstate = "running";
      this.song.play(~~at);
    }
    // ================================================================= connectedCallback
    connectedCallback() {
      this.render();
      // -----------------------------------------------------------------
      this.song.addEventListener("song-line-reset", () => this.restart);
      // -----------------------------------------------------------------
      this.onclick = (evt) => {
        evt.stopPropagation(); // don't execute any other clicks
        this.restart();
        this.play(this.at);
      };
      // -----------------------------------------------------------------
      this.audio.addEventListener("timeupdate", () => {
        if (this.paststarttime) {
          if (this.isrunning) return;
          this.play();
        } else {
          this.pause();
        }
      });
    }
    // ================================================================= render
    render() {
      let background = "var(--pausecircleBackground)";
      let stroke = "var(--wordBackgroundColorHighlight)";

      let css =
        /*css*/ `#counter {` +
        `animation:circle ${this.duration}s linear;` +
        `animation-play-state:paused` +
        `}@keyframes circle {` +
        ` from {stroke-dasharray: 0 100} to {stroke-dasharray: 100 0} ` +
        `}`;

      this.shadowRoot.innerHTML =
        /*html*/ `<svg viewBox="0 0 100 100" style="width:100%">` +
        `<style>${css}</style>` +
        `<circle cx="50%" cy="50%" r="50%" fill="${background}"></circle>` +
        `<circle id="counter" stroke="${stroke}" transform="rotate(-90 50 50)" pathLength="100" ` +
        `cx="50%" cy="50%" r="25%" fill="none" stroke-width="50%"></circle>` +
        `</svg>`;
    }
    // ================================================================= restart
    restart() {
      this.render();
    }
  }
);
