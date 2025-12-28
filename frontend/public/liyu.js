let currentTitle = "";
let isDesktop = window.innerWidth >= 769;
const ORIGIN = window.location.origin;
const prefetched = new Set();
let lastUrl = "";

const listEl = document.getElementById("list");
const viewerEl = document.getElementById("viewer");
const viewerTitleEl = document.getElementById("viewerTitle");
const loadingEl = document.getElementById("loading");
const iframeEl = document.getElementById("contentFrame");
const containerEl = document.querySelector(".container");

function debounce(fn, delay = 150) {
  let timer;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(fn, delay);
  };
}

function postHeight(action) {
  if (window.parent === window) return;
  try {
    window.parent.postMessage(
      {
        type: "iframeHeight",
        height: document.documentElement.scrollHeight,
        action,
      },
      ORIGIN
    );
  } catch (e) {}
}

function showSpinner() {
  if (loadingEl.style.display === "flex") return;
  loadingEl.innerHTML = "";
  const spinner = document.createElement("div");
  spinner.className = "spinner";
  const p = document.createElement("p");
  p.textContent = "በመጫን ላይ...";
  loadingEl.appendChild(spinner);
  loadingEl.appendChild(p);
  loadingEl.style.display = "flex";
}

function checkScreenSize() {
  const nowDesktop = window.innerWidth >= 769;
  if (nowDesktop === isDesktop) return;

  isDesktop = nowDesktop;
  if (listEl.style.display !== "block") listEl.style.display = "block";
  viewerEl.style.display = isDesktop ? "flex" : "none";
}

function openDocument(url, title) {
  if (!url || url === lastUrl) return;
  lastUrl = url;
  currentTitle = title;

  if (!isDesktop) listEl.style.display = "none";
  viewerEl.style.display = "flex";
  viewerTitleEl.textContent = title;

  showSpinner();
  iframeEl.classList.remove("active");
  iframeEl.src = url;
}

function showList() {
  iframeEl.src = "";
  iframeEl.classList.remove("active");
  lastUrl = "";

  if (!isDesktop) {
    viewerEl.style.display = "none";
    listEl.style.display = "block";
  } else {
    viewerTitleEl.textContent = "ሰነድ ይምረጡ";
  }

  showSpinner();
  postHeight("showList");
}

window.openDocument = openDocument;
window.showList = showList;

if (iframeEl) {
  iframeEl.onload = () => {
    loadingEl.style.display = "none";
    iframeEl.classList.add("active");
    postHeight();
  };

  iframeEl.onerror = () => {
    loadingEl.innerHTML =
      '<p style="color:#f87171;">ስህተት: ፋይሉን መጫን አልተቻለም</p>' +
      '<button class="back-button" onclick="showList()" style="margin-top:1rem;">ወደ ዝርዝር ተመለስ</button>';
  };
}

let prefetchTimer;
document.addEventListener("mouseover", (e) => {
  const btn = e.target.closest(".link-button");
  if (!btn) return;

  clearTimeout(prefetchTimer);
  prefetchTimer = setTimeout(() => {
    const match = btn.getAttribute("onclick")?.match(/'(https:[^']+\.pdf)'/);
    if (!match) return;
    const url = match[1];
    if (prefetched.has(url)) return;

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    document.head.appendChild(link);
    prefetched.add(url);
  }, 300);
});

document.addEventListener("DOMContentLoaded", () => {
  checkScreenSize();
  if (isDesktop) {
    const firstButton = document.querySelector(".link-button");
    if (firstButton) firstButton.click();
  }
  postHeight("loaded");
});

window.addEventListener("resize", debounce(checkScreenSize));
window.addEventListener("beforeunload", () => {
  iframeEl.src = "about:blank";
});

window.addEventListener("message", (event) => {
  if (
    event.data &&
    event.data.type === "resizeIframe" &&
    containerEl &&
    event.data.height
  ) {
    containerEl.style.height = event.data.height + "px";
  }
});

if (window.parent !== window && "ResizeObserver" in window) {
  let resizeTimer;
  const resizeObserver = new ResizeObserver(() => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => postHeight(), 100);
  });
  resizeObserver.observe(document.body);
}
