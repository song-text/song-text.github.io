customElements.define(
  "song-text",
  class extends HTMLElement {
    // ================================================================= audio
    get audio() {
      return this.querySelector("audio");
    }
    // ================================================================= allwords
    get allwords() {
      return [...this.querySelectorAll("song-word")];
    }
    // ================================================================= currentTime
    get currentTime() {
      return this.audio.currentTime;
    }
    set currentTime(val) {
      val = ~~val / 1000;
      console.log("play", val, this.audio.duration);
      this.audio.currentTime = val;
    }
    // ================================================================= play
    play(at = false) {
      this.audio.play(); //! if audio is not playing, currentTime can't be reset
      if (at) this.currentTime = at;
      this.audio.play();
    }
    // ================================================================= connectedCallback
    connectedCallback() {
      document.body.addEventListener("click", () => {
        if (this.audio.paused) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      });
      // -----------------------------------------------------------------
      // make sure <song-text> is parsed by browser, so we can now read/proces its innerHTML
      setTimeout(() => {
        let html = this.innerHTML;
        // -----------------------------------------------------------------
        this.render();
        // -----------------------------------------------------------------
        this.html2words(html);
        // -----------------------------------------------------------------
        //! execute after audio is loaded
        this.audio.oncanplay = () => {
          console.log("ready", this.audio.duration, this.currentTime);
          this.audio.playbackRate = 1;
        };
      }, 0);
    }
    // ================================================================= rendere
    render() {
      this.innerHTML =
      `<audio controls src="${this.getAttribute("src")}" hidden></audio>` +
      `<div id="words"></div>`;
    }
    // ================================================================= html2words
    html2words(html) {
      let previousWordTime = 0;
      let at;
      let currenttime = 0;
      html = html
        .split("\n")
        .map((line, idx) => line.trim())
        .filter(Boolean) // remove undefined (empty lines)
        .map((line, lineIdx) => {
          // -----------------------------------------------------------------
          let songwords = line.match(/\+?(\d+)*?[=](\w+)/g);
          if (songwords) {
            //console.log(`%c ${this.nodeName} `, "background:gold", songwords);
            line = songwords
              .map((songword, wordIdx) => {
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                let [time, word] = songword.split("=");
                let at_attr = ` at="${time}" `;
                let duration_attr = ` duration="${time - previousWordTime}" `;
                at = currenttime += Number(time);
                word = `<song-word ${at_attr}>${""} ${word}</song-word>`;
                // put a pause before the first word
                let pause =
                  wordIdx == 0
                    ? `<song-pause ${at_attr} ${duration_attr}></song-pause>`
                    : ""; // no pause before first word of first line
                previousWordTime = time;
                if (pause)
                  console.log(`%c ${this.nodeName} `, "background:gold", pause);
                // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                return pause + word;
              })
              .join("");
          } else {
            console.warn("No times in line", lineIdx, ":", line);
          }
          return `<song-line>` + line + `</song-line>`;
          // -----------------------------------------------------------------
        })
        .join(``);
      this.querySelector("#words").innerHTML = html;
    } // html2words
    // ================================================================= words2html
    words2html() {
      // -----------------------------------------------------------------
      // to be implemented ?
    }
  }
);
