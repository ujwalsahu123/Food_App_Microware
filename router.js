// Initialize router
function initRouter() {
    // Handle initial route
    handleRouteChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleRouteChange);
}

// Handle route changes
function handleRouteChange() {
    window.scrollTo(0, 0); // Reset scroll to top
    const hash = window.location.hash.substring(1); // Remove #
    const params = new URLSearchParams(hash);

    if (params.has('section')) {
        const sectionId = params.get('section');
        renderRecipeList(getRecipesBySection(sectionId));
    } else if (params.has('recipe')) {
        const recipeId = params.get('recipe');
        renderRecipeDetail(recipeId);
    } else {
        renderSections();
    }
}

// Navigate to a route
function navigateTo(route) {
    window.location.hash = route;
}

// Get recipes by section
function getRecipesBySection(sectionId) {
    return appState.recipes.filter(recipe => recipe.section === sectionId);
}

// Get recipe by ID
function getRecipeById(recipeId) {
    return appState.recipes.find(recipe => recipe.id === recipeId);
}