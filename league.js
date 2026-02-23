// Get league from URL
const params = new URLSearchParams(window.location.search);
const leagueName = params.get("league");

// Elements
const container = document.getElementById("highlights-container");
const leagueHeader = document.getElementById("league-header");
const backBtn = document.getElementById("back-btn");

// Back button
backBtn.addEventListener("click", () => {
  history.back();
});

// Offline card function
function showOfflineCard(show) {
  const offlineCard = document.getElementById("offline-card");
  if (offlineCard) {
    offlineCard.style.display = show ? "block" : "none";
  }
}

// Load data only if online
function loadLeagueData() {
  if (!navigator.onLine) {
    showOfflineCard(true);
    return;
  }

  showOfflineCard(false);

  fetch("highlights.json")
    .then(res => res.json())
    .then(data => {
      // Find league info
      const leagueInfo = data.leagues.find(l =>
        l.name.trim().toLowerCase() === leagueName.trim().toLowerCase()
      );

      if (!leagueInfo) {
        container.innerHTML = "<p>League not found.</p>";
        return;
      }

      // Show league header
      leagueHeader.innerHTML = `
        <img src="${leagueInfo.logo}" class="league-logo-large" alt="${leagueInfo.name}">
        <h2 class="league-title">${leagueInfo.name}</h2>
      `;

      // Filter highlights
      const leagueHighlights = data.highlights.filter(h =>
        h.league.trim().toLowerCase() === leagueName.trim().toLowerCase()
    );

      if (!leagueHighlights || leagueHighlights.length === 0) {
        container.innerHTML = "<p>No highlights available for this league.</p>";
        return;
}

      // Render highlights with lazy load blur
    // Replace your old forEach loop with this
leagueHighlights.forEach(h => {
  const row = document.createElement("div");
  row.className = "highlight-row";

  row.innerHTML = `
    <div class="highlight-content">
      <h3>${h.title}</h3>
      <p>${h.date}</p>
    </div>
    <img src="${h.thumbnail}" alt=" ${h.title}" loading="lazy" class="blur">
  `;

  // Unblur on load - improved
  const img = row.querySelector("img");
  img.addEventListener("load", () => {
    img.classList.remove("blur");
});

  // Immediate check for cached images (this is the new part that fixes stuck blur)
  if (img.complete) {
    img.classList.remove("blur");
    }

  // On error, remove blur and show fallback (optional - add placeholder image if you have one)
  img.addEventListener("error", () => {
    img.classList.remove("blur");
    img.src = 'images/placeholder.jpg'; // replace with your fallback image path, or remove this line
});

  // Click row to open video (kept the same)
  row.addEventListener("click", () => {
    window.location.href = `video.html?video=${encodeURIComponent(h.video)}`;
  });

  container.appendChild(row);
});
    })
    .catch(err => {
      console.error("Fetch failed:", err);
      showOfflineCard(true);
    });
}

// Load on page start
loadLeagueData();

// Listen for network changes
window.addEventListener("offline", () => {
  showOfflineCard(true);
  // Stop any ongoing loads  but browsers handle this automatically
});

window.addEventListener("online", () => {
  showOfflineCard(false);
  // Optional: auto-reload to fetch missing thumbnails
  location.reload();
});

// Retry / Settings buttons
document.getElementById("retry-btn").addEventListener("click", () => {
  location.reload();
});

document.getElementById("settings-btn").addEventListener("click", () => {
  alert("Enable Wi-Fi or Mobile Data in your device settings.");
});