const audio = document.getElementById("audioPlayer");
const nowTitle = document.getElementById("nowPlayingTitle");
const nowUrl = document.getElementById("nowPlayingUrl");
function play(title, url, element) {
  if (nowTitle) {
    nowTitle.textContent = title;
  }

  if (nowUrl) {
    nowUrl.textContent = url;
  }

  if (audio) {
    audio.src = url;
    audio.play();
  }

  const active = document.querySelector(".song-active");
  if (active) {
    active.classList.remove("song-active");
  }
  if (element && element.classList) {
    element.classList.add("song-active");
  }
}
