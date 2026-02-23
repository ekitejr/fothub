let allHighlights = [];

// Load data
fetch('highlights.json')
  .then(res => res.json())
  .then(data => {
    allHighlights = data.highlights;
    console.log('Loaded ' + allHighlights.length + ' highlights');
  })
  .catch(err => console.error('Load error:', err));

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const suggestionsContainer = document.getElementById('suggestions-container');
  const resultsContainer = document.getElementById('results-container');
  const emptyMessage = document.getElementById('empty-message');
  const spinner = document.getElementById('search-spinner'); // Add this for spinner

  if (!searchInput || !suggestionsContainer || !resultsContainer) return;

  // Show suggestions while typing
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    if (query.length === 0) {
      suggestionsContainer.innerHTML = '';
      suggestionsContainer.style.display = 'none';
      resultsContainer.innerHTML = '';
      resultsContainer.style.display = 'none';
      spinner.style.display = 'none'; // Hide spinner
      emptyMessage.style.display = 'block';
      return;
    }

    // Offline? Show spinner
    if (!navigator.onLine) {
      suggestionsContainer.style.display = 'none';
      resultsContainer.style.display = 'none';
      emptyMessage.style.display = 'none';
      spinner.style.display = 'block';
      return;
    }

    // Online  hide spinner
    spinner.style.display = 'none';

    const matches = allHighlights.filter(h => h.title.toLowerCase().includes(query));

    suggestionsContainer.innerHTML = '';

    if (matches.length === 0) {
      suggestionsContainer.innerHTML = '<p style="color:#888; text-align:center; padding:20px;">No matches found</p>';
      emptyMessage.style.display = 'none';
    } else {
      matches.forEach(h => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = h.title;

        // Click suggestion  show full results
        item.addEventListener('click', () => {
          searchInput.value = h.title;  // set bar to selected title
          showFullResults(h.title.toLowerCase());
        });

        suggestionsContainer.appendChild(item);
      });
    }

    suggestionsContainer.style.display = 'block';
  });

  // Press Enter  show full results
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      if (query.length > 0) {
        showFullResults(query);
      }
    }
  });

  function showFullResults(query) {
    const matches = allHighlights.filter(h => h.title.toLowerCase().includes(query));

    suggestionsContainer.style.display = 'none';
    suggestionsContainer.innerHTML = '';
    emptyMessage.style.display = 'none';
    spinner.style.display = 'none'; // Hide spinner

    resultsContainer.innerHTML = '';

    if (matches.length === 0) {
      resultsContainer.innerHTML = '<p style="color:#888; text-align:center; padding:20px;">No results found</p>';
    } else {
      matches.forEach(h => {
        const item = document.createElement('div');
        item.className = 'result-item';

        item.innerHTML = `
          <img src=" ${h.thumbnail}" alt=" ${h.title}" loading="lazy">
          <div class="result-info">
            <p class="result-title">${h.title}</p>
            <p class="result-description">${h.league}  ${h.date}</p>
          </div>
        `;

        // Click to open video
        item.addEventListener('click', () => {
          window.location.href = `video.html?video=${encodeURIComponent(h.video)}`;
      });

        resultsContainer.appendChild(item);
    });
    }

    resultsContainer.style.display = 'block';
  }

  // Back button
  document.getElementById('back-btn').addEventListener('click', () => {
    window.history.back();
  });

  // Auto-focus input
  searchInput.focus();

  // When online, re-trigger input to show results
  window.addEventListener('online', () => {
    spinner.style.display = 'none';
    if (searchInput.value.trim().length > 0) {
      searchInput.dispatchEvent(new Event('input')); // refresh suggestions/results
    }
  });
});