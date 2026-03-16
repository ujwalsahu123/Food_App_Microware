// Global app state
const appState = {
    sections: [],
    recipes: [],
    microwave: {}
};

// Load JSON data
async function loadData() {
    try {
        const [sectionsRes, recipesRes, microwaveRes] = await Promise.all([
            fetch('data/section.json'),
            fetch('data/recipy.json'),
            fetch('data/microwave.json')
        ]);

        appState.sections = await sectionsRes.json();
        const recipesData = await recipesRes.json();
        appState.recipes = recipesData.recipes;
        appState.microwave = await microwaveRes.json();

        // Initialize the app
        initApp();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

// Initialize the app
function initApp() {
    // Set up event listeners
    document.getElementById('hamburger').addEventListener('click', toggleSidebar);
    document.getElementById('close-sidebar').addEventListener('click', closeSidebar);
    document.getElementById('overlay').addEventListener('click', closeSidebar);
    document.getElementById('search').addEventListener('input', handleSearch);

    // Render sidebar
    renderSidebar();

    // Initialize router
    initRouter();
}

let scrollPosition = 0;

function lockBodyScroll() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    document.body.style.setProperty('--scroll-y', `-${scrollPosition}px`);
    document.body.classList.add('sidebar-open');
}

function unlockBodyScroll() {
    document.body.classList.remove('sidebar-open');
    document.body.style.removeProperty('--scroll-y');
    window.scrollTo(0, scrollPosition);
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    const open = !sidebar.classList.contains('hidden');
    if (open) {
        sidebar.classList.add('hidden');
        overlay.classList.add('hidden');
        unlockBodyScroll();
    } else {
        sidebar.classList.remove('hidden');
        overlay.classList.remove('hidden');
        lockBodyScroll();
    }
}

// Close sidebar
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.add('hidden');
    overlay.classList.add('hidden');
    unlockBodyScroll();
}

// Handle search
function handleSearch(event) {
    const query = event.target.value.toLowerCase();
    if (query) {
        const filteredRecipes = searchRecipes(query);
        window.scrollTo(0, 0);
        renderRecipeList(filteredRecipes);
    } else {
        // If search is empty, go back to current route
        handleRouteChange();
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', loadData);