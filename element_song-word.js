// create Web Component
// <song-word at="1000"></song-word>
customElements.define(
  "song-word",
  class extends HTMLElement {
    // ================================================================= getters
    get wordstarttime() {
      return ~~this.at / 1000;
    }
    get paststarttime() {
      return this.song.currentTime > this.wordstarttime;
    }
    get song() {
      return this.closest("song-text");
    }
    get audio() {
      return this.song.audio;
    }
    get at() {
      return this.getAttribute("at") || console.error("No attribute 'at'");
    }
    get wordnr() {
      return [...this.parentNode.children].indexOf(this);
    }
    // ================================================================= methods
    play(at) {
      this.song.play(~~at);
    }
    // ================================================================= connectedCallback
    connectedCallback() {
      // -----------------------------------------------------------------
      this.audio.addEventListener("timeupdate", () => {
        if (this.paststarttime) {
          this.style.background = "var(--wordBackgroundColorHighlight)";
        } else {
          this.style.background = "var(--wordBackgroundColor)";
        }
      });
      // -----------------------------------------------------------------
      this.onclick = (evt) => {
        evt.stopPropagation();
        this.song.dispatchEvent(new CustomEvent("song-line-reset"));
        this.play(this.at);
      };
      // ----------------------------------------------- ------------------
      let wordnr = this.song.allwords.indexOf(this);
      if (wordnr == 0) {
        let gap = this.at - this.song.allwords[wordnr - 1]?.at;
        console.log(wordnr, this.wordnr, gap);
      }
    }
  }
);
