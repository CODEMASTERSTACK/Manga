// Fetch manga data from the serverless function
async function fetchManga(endpoint) {
    try {
        const response = await fetch(`/api/manga-proxy?endpoint=${encodeURIComponent(endpoint)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
        const data = await response.json();
        console.log("Received data:", data); // Add this line for debugging
        return data;
    } catch (error) {
        console.error("Error fetching manga:", error);
        throw error;
    }
}

// Display manga in a grid
function displayManga(mangaList, gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';

    if (!mangaList || !mangaList.data || mangaList.data.length === 0) {
        grid.innerHTML = '<p>No manga found.</p>';
        return;
    }

    mangaList.data.forEach(manga => {
        const card = document.createElement('div');
        card.className = 'manga-card';
        card.innerHTML = `
            <h3>${manga.attributes.title.en || 'No title'}</h3>
            <p>${manga.attributes.description.en ? manga.attributes.description.en.substring(0, 100) + '...' : 'No description'}</p>
        `;
        grid.appendChild(card);
    });
}

// Fetch and display recently added manga
async function loadRecentlyAdded() {
    const recentManga = await fetchManga('/manga?order[createdAt]=desc&limit=10');
    displayManga(recentManga, 'recently-added-grid');
}

// Fetch and display most reading manga
async function loadMostReading() {
    const mostReadingManga = await fetchManga('/manga?order[followedCount]=desc&limit=10');
    displayManga(mostReadingManga, 'most-reading-grid');
}

// Fetch and display popular manga
async function loadPopular() {
    const popularManga = await fetchManga('/manga?order[rating]=desc&limit=10');
    displayManga(popularManga, 'popular-grid');
}

// Fetch and display categories
async function loadCategories() {
    const categories = await fetchManga('/manga/tag');
    const categoryList = document.getElementById('category-list');

    if (!categories || !categories.data || categories.data.length === 0) {
        categoryList.innerHTML = '<p>No categories found.</p>';
        return;
    }

    categories.data.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = category.attributes.name.en;
        button.onclick = () => loadMangaByCategory(category.id);
        categoryList.appendChild(button);
    });
}

// Fetch and display manga by category
async function loadMangaByCategory(categoryId) {
    const mangaInCategory = await fetchManga(`/manga?includedTags[]=${categoryId}&limit=10`);
    displayManga(mangaInCategory, 'category-grid');
}

// Initialize the page
async function init() {
       try {
           await loadRecentlyAdded();
           await loadMostReading();
           await loadPopular();
           await loadCategories();
       } catch (error) {
           console.error("Error initializing page:", error);
           // Display an error message to the user
           const errorMessage = document.getElementById('error-message');
           if (errorMessage) {
               errorMessage.textContent = "An error occurred while loading the page. Please try again later.";
           }
       }
   }

// Run initialization when the page loads
window.onload = init;
