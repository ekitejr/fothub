// Get video URL from query string
function getVideoURL() {
  const params = new URLSearchParams(window.location.search);
  const videoURL = params.get("video");
  return videoURL;
}

// Set iframe src to play video
function loadVideo() {
  const iframe = document.getElementById("highlight-video");
  const videoURL = getVideoURL();

  if (!videoURL) {
    iframe.style.display = "none";
    const msg = document.createElement("p");
    msg.textContent = "Video not found!";
    msg.style.color = "white";
    msg.style.textAlign = "center";
    msg.style.marginTop = "20px";
    document.querySelector(".video-wrapper").appendChild(msg);
    return;
  }

  // Auto-play the video
  // Add ?autoplay=1 for YouTube videos
  let autoplayURL = videoURL;
  if (videoURL.includes("youtube.com") && !videoURL.includes("autoplay=1")) {
    autoplayURL += (videoURL.includes("?") ? "&" : "?") + "autoplay=1";
  }

  iframe.src = autoplayURL;
}

// Back button logic
function setupBackButton() {
  const btn = document.getElementById("back-btn");
  btn.addEventListener("click", () => {
     window.history.back(); // Go back to previous page
    // Or use: window.location.href = "index.html";
  });
}

// Run when page loads
window.addEventListener("load", () => {
  loadVideo();
  setupBackButton();
});

// -------------------------------
// SPINNER LOGIC
// -------------------------------

const iframe = document.getElementById("highlight-video");
const spinner = document.querySelector(".spinner");

// Function to update spinner based on network status
function updateSpinner() {
  if (!navigator.onLine) {
    // User offline  show spinner, hide video
    spinner.style.display = "flex";
    iframe.style.display = "none";
} else {
    // User online  show video, keep spinner until iframe loads
    iframe.style.display = "block";
    spinner.style.display = "flex";
  }
}

// Hide spinner when iframe finishes loading
iframe.addEventListener("load", () => {
  if (navigator.onLine) {
    spinner.style.display = "none";
  }
});

// Initial check when page loads
updateSpinner();

// Listen for network changes
window.addEventListener("online", updateSpinner);
window.addEventListener("offline", updateSpinner);


function loadRelatedHighlights() {
  const params = new URLSearchParams(window.location.search);
  const currentVideoURL = params.get("video");
  const relatedContainer = document.getElementById("related-highlights");

  // Clear previous content
  relatedContainer.innerHTML = "";

  // If offline, show message in the same container
  if (!navigator.onLine) {
    const msg = document.createElement("p");
    msg.textContent = "Cannot load related highlights while offline";
    msg.style.color = "#aaa";
    msg.style.fontSize = "0.9rem";
    msg.style.textAlign = "center";
    relatedContainer.appendChild(msg);
    return;
}

  // Online: fetch highlights JSON
  fetch('highlights.json')
    .then(res => res.json())
    .then(data => {
      const highlightsJSON = data.highlights;
      const currentHighlight = highlightsJSON.find(h => h.video === currentVideoURL);
      if (!currentHighlight) {
        relatedContainer.innerHTML = "<p style='color:#aaa;text-align:center;'>Highlight not found</p>";
        return;
      }

      // Filter related highlights in the same league
      const related = highlightsJSON.filter(
        h => h.league === currentHighlight.league && h.video !== currentVideoURL      );

      if (related.length === 0) {
        relatedContainer.innerHTML = "<p style='color:#aaa;text-align:center;'>No more highlights in this league</p>";
        return;
      }

      // Add related highlight cards
      related.forEach(h => {
        const card = document.createElement("div");
        card.classList.add("related-card");
        card.innerHTML = `
          <img src="${h.thumbnail}" alt="${h.title}">
          <p>${h.title}</p>
        `;
        card.addEventListener("click", () => {
          window.location.href = `video.html?video=${encodeURIComponent(h.video)}`;
      });
        relatedContainer.appendChild(card);
    });
})
    .catch(err => {
      relatedContainer.innerHTML = "<p style='color:#aaa;text-align:center;'>Failed to load related highlights</p>";
      console.error(err);
    });
}

// Update automatically when going online/offline
window.addEventListener("online", loadRelatedHighlights);
window.addEventListener("offline", loadRelatedHighlights);

// Initial call
loadRelatedHighlights();

// Direct close to home button
const closeBtn = document.getElementById("close-to-home");
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    // Jump directly to home page (index.html)
    window.location.href = "index.html";   // or "./index.html" if needed
    // Alternative: window.location.replace("index.html"); // no history entry
});
}