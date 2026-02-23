// Load leagues and highlights from JSON
async function loadLeagues() {
  try {
    const res = await fetch("highlights.json");
    const data = await res.json();

    const leagues = data.leagues;       // List of leagues with logo
    const highlights = data.highlights; // All highlights

    const container = document.getElementById("leagues-container");
    container.innerHTML = ""; // Clear container

    leagues.forEach(league => {
      // Filter highlights for this league
      // Filter, sort by newest, and limit to 15
let leagueHighlights = highlights  .filter(h => h.league === league.name)          // filter by league
  .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
  .slice(0, 15);                                  // take only newest 15

      // Skip league if no highlights
      if (leagueHighlights.length === 0) return;

      // Create league section
      const section = document.createElement("div");
      section.className = "league-section";

      // League header with logo + name + See All button
      section.innerHTML = `
        <div class="league-header">
          <div class="league-left">
            <img src="${league.logo}" class="league-logo" alt="${league.name}">
            <h2>${league.name}</h2>
          </div>
          <button class="see-all" data-league="${league.name}">See All</button>
        </div>
        <div class="cards-container" id="cards-${league.name.replace(/\s+/g,'-')}"></div>
      `;
      container.appendChild(section);

      const cardsContainer = section.querySelector(".cards-container");

      // Create cards for this league
      leagueHighlights.forEach(cardData => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <img src="${cardData.thumbnail}" alt="${cardData.title}">
          <p>${cardData.title}</p>
        `;
        cardsContainer.appendChild(card);

        const img = card.querySelector("img");

        // Remove blur if image loads
        img.addEventListener("load", () => img.classList.remove("blur"));

        // Blur if image fails to load (offline / broken)
        img.addEventListener("error", () => img.classList.add("blur"));

        // If offline initially  blur missing images
        if (!navigator.onLine) img.classList.add("blur");

        // Listen for online/offline changes
        window.addEventListener("online", () => img.classList.remove("blur"));
        window.addEventListener("offline", () => img.classList.add("blur"));

        // Click card  go to video page
        card.addEventListener("click", () => {
          window.location.href = `video.html?video=${encodeURIComponent(cardData.video)}`;
  });
});

      // See All button  go to league.html
      const seeAllBtn = section.querySelector(".see-all");
      seeAllBtn.addEventListener("click", () => {
        window.location.href = `league.html?league=${encodeURIComponent(league.name)}`;
      });
    });
  } catch (err) {
    console.error("Failed to load highlights.json", err);
    const container = document.getElementById("leagues-container");
    if (!navigator.onLine) {
      container.innerHTML = "<p style='color:gray'>You are offline. Connect to internet to load highlights.</p>";
    } else {
      container.innerHTML = "<p style='color:red'>Failed to load highlights. Check highlights.json file.</p>";
    }
  }
} 

// Run when page loads
window.addEventListener("load", loadLeagues);


// 
// Offline Banner Logic
// 

function updateOfflineBanner() {
  const banner = document.getElementById("offline-banner");
  if (banner) {
    const isOffline = !navigator.onLine;
    banner.style.display = isOffline ? "flex" : "none";
}
}

// Run once when page loads
updateOfflineBanner();

// Listen for network changes (Wi-Fi on/off)
window.addEventListener("online", updateOfflineBanner);
window.addEventListener("offline", updateOfflineBanner);

// Retry button inside banner
document.addEventListener("DOMContentLoaded", () => {
  const retryBtn = document.getElementById("retry-connection");
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      location.reload(); // Refresh page to retry loading data
    });
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('search-bar');
  if (searchBar) {
    searchBar.addEventListener('click', () => {
      window.location.href = 'search.html';
    });
  }
});


// Rotating suggestions (add as many as you want  football/movies/anime themed)
const searchSuggestions = [
  "Real Madrid",
  "Manchester city",
  "Uefa CL",
  "bayern munich",
  "Barcelona",
  "Inter milan",
  "Ajax",
  "Simb SC",
  "Young African",
  "CAF CL",
  "Atletico Madrid",
  "Europa league",
  "Bourissia Dortmund",
  "Afcon",
  "FIFA WORLD CUP"
];

function startRotatingPlaceholder(placeholderId, interval = 2500) {  // 2.5 seconds per suggestion
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) return;

  let index = 0;

  function rotate() {
    placeholder.style.opacity = '0';

    setTimeout(() => {
      placeholder.textContent = searchSuggestions[index];
      placeholder.style.opacity = '1';
      index = (index + 1) % searchSuggestions.length;
    }, 500); // fade duration
  }

  rotate(); // start immediately
  setInterval(rotate, interval);
}

// Start rotation on both pages
document.addEventListener('DOMContentLoaded', () => {
  // Home page bar
  startRotatingPlaceholder('home-placeholder', 3000); // slower on home

  // Search page bar
  startRotatingPlaceholder('search-placeholder', 2500);

  // Stop rotation & hide when input is focused/typed (search page only)
  const searchInput = document.getElementById('search-input');
  const searchPlaceholder = document.getElementById('search-placeholder');
  if (searchInput && searchPlaceholder) {
    searchInput.addEventListener('focus', () => {
      searchPlaceholder.style.opacity = '0';
    });
    searchInput.addEventListener('input', () => {
      if (searchInput.ariaValueMax.trim() !== '') {
        searchPlaceholder.style.opacity = '0';
      }
    });
  }
});