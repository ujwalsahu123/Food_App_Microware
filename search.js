// Search recipes
function searchRecipes(query) {
    return appState.recipes.filter(recipe => {
        const nameMatch = recipe.name.en.toLowerCase().includes(query) ||
                         (recipe.name.hi && recipe.name.hi.toLowerCase().includes(query));
        const tagsMatch = recipe.tags && recipe.tags.some(tag => tag.toLowerCase().includes(query));
        const codeMatch = recipe.microwave && recipe.microwave.code && recipe.microwave.code.toLowerCase().includes(query);
        const buttonCodeMatch = recipe.microwave && recipe.microwave.button_code && recipe.microwave.button_code.toLowerCase().includes(query);

        return nameMatch || tagsMatch || codeMatch || buttonCodeMatch;
    });
}