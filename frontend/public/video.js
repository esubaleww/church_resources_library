const videoFrame = document.getElementById("videoFrame");
const viewer = document.getElementById("viewer");
const viewerTitle = document.getElementById("viewerTitle");
const defaultMessage = document.getElementById("defaultMessage");
const videoButtons = Array.from(document.querySelectorAll(".link-button"));

function setActiveButton(activeBtn) {
  videoButtons.forEach((btn) => btn.classList.remove("active"));
  if (activeBtn) activeBtn.classList.add("active");
}

function openVideo(embedUrl, title, button = null) {
  if (!videoFrame || !viewer) return;

  videoFrame.src = embedUrl;

  if (viewerTitle && title) viewerTitle.textContent = title;

  if (defaultMessage) defaultMessage.style.display = "none";

  viewer.classList.add("active");
  viewer.style.display = "flex";

  setActiveButton(button);
}

function showList() {
  if (videoFrame) videoFrame.src = "";
  if (viewer) {
    viewer.classList.remove("active");
    viewer.style.display = "none";
  }
  setActiveButton(null);
}

document.addEventListener("DOMContentLoaded", () => {
  videoButtons.forEach((btn) => {
    const url = btn.getAttribute("onclick")?.match(/'([^']+)'/)[1];
    const title =
      btn.getAttribute("onclick")?.match(/'[^']+','([^']+)'/)[1] ||
      btn.innerText.trim();

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openVideo(url, title, btn);
    });
  });

  if (videoButtons.length > 0) {
    const firstBtn = videoButtons[0];
    const url = firstBtn.getAttribute("onclick")?.match(/'([^']+)'/)[1];
    const title = firstBtn
      .getAttribute("onclick")
      ?.match(/'[^']+','([^']+)'/)[1];
    openVideo(url, title, firstBtn);
  }
});

window.openVideo = openVideo;
window.showList = showList;
