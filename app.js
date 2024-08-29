// Fetch manga data from the serverless function
async function fetchManga(endpoint) {
    const response = await fetch(`/.netlify/functions/manga-proxy?endpoint=${endpoint}`);
    return await response.json();
}

// Display manga in a grid
function displayManga(mangaList, gridId) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';

    mangaList.forEach(manga => {
        const card = document.createElement('div');
        card.className = 'manga-card';
        card.innerHTML = `
            <img src="${manga.coverImage}" alt="${manga.title}">
            <h3>${manga.title}</h3>
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

    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-button';
        button.textContent = category.name;
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
function init() {
    loadRecentlyAdded();
    loadMostReading();
    loadPopular();
    loadCategories();
}

// Run initialization when the page loads
window.onload = init;