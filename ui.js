// Render sections page
function renderSections() {
    const main = document.getElementById('main-content');
    main.innerHTML = '<h1>Sections</h1><div class="grid" id="sections-grid"></div>';

    const grid = document.getElementById('sections-grid');
    appState.sections.sections.forEach(section => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => navigateTo(`section=${section.id}`);

        card.innerHTML = `
            <img src="${section.image}" alt="${section.name.en}" loading="lazy">
            <div class="card-content">
                <div class="name">${section.name.en}<br>${section.name.hi}</div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Render recipe list page
function renderRecipeList(recipes) {
    const main = document.getElementById('main-content');
    main.innerHTML = '<h1>Recipes</h1><div class="grid" id="recipes-grid"></div>';

    const grid = document.getElementById('recipes-grid');
    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'card';
        card.onclick = () => navigateTo(`recipe=${recipe.id}`);

        card.innerHTML = `
            <img src="${recipe.image || 'images/placeholder.png'}" alt="${recipe.name.en}" loading="lazy" onerror="this.src='images/placeholder.png'">
            <div class="card-content">
                <div class="name">${recipe.name.en}<br>${recipe.name.hi}</div>
            </div>
        `;

        grid.appendChild(card);
    });
}

// Render recipe detail page
function renderRecipeDetail(recipeId) {
    const recipe = getRecipeById(recipeId);
    if (!recipe) return;

    const main = document.getElementById('main-content');

    let metadata = '';
    if (recipe.serves) metadata += `<p><strong>Serves:</strong> ${recipe.serves}</p>`;
    if (recipe.microwave && recipe.microwave.power) metadata += `<p><strong>Microwave Mode:</strong> ${recipe.microwave.power}</p>`;
    if (recipe.microwave && recipe.microwave.code) metadata += `<p><strong>Microwave Code:</strong> ${recipe.microwave.code}</p>`;
    if (recipe.microwave && recipe.microwave.button_code) metadata += `<p><strong>Button Code:</strong> ${recipe.microwave.button_code}</p>`;

    const ingredientsHi = recipe.ingredients.hi ? `<h2>Ingredients (Hindi)</h2><ul>${recipe.ingredients.hi.map(item => `<li>${item}</li>`).join('')}</ul>` : '';
    const ingredientsEn = recipe.ingredients.en ? `<h2>Ingredients (English)</h2><ul>${recipe.ingredients.en.map(item => `<li>${item}</li>`).join('')}</ul>` : '';

    const recipeHi = recipe.recipe.hi ? `<h2>Recipe Steps (Hindi)</h2><ol>${recipe.recipe.hi.map(step => `<li>${step}</li>`).join('')}</ol>` : '';
    const recipeEn = recipe.recipe.en ? `<h2>Recipe Steps (English)</h2><ol>${recipe.recipe.en.map(step => `<li>${step}</li>`).join('')}</ol>` : '';

    main.innerHTML = `
        <div class="recipe-detail">
            <img src="${recipe.image || 'images/placeholder.png'}" alt="${recipe.name.en}" loading="lazy" onerror="this.src='images/placeholder.png'">
            <div class="name">${recipe.name.en}<br>${recipe.name.hi}</div>
            ${metadata}
            <hr>
            ${ingredientsHi}
            ${ingredientsEn}
            <hr>
            ${recipeHi}
            ${recipeEn}
        </div>
    `;
}

// Render sidebar
function renderSidebar() {
    const sidebar = document.getElementById('sidebar-content');
    sidebar.innerHTML = '';

    // Power
    if (appState.microwave.power) {
        const powerSection = document.createElement('div');
        powerSection.className = 'sidebar-section';
        powerSection.innerHTML = '<h3>Power</h3>';
        appState.microwave.power.forEach(power => {
            const card = document.createElement('div');
            card.className = 'sidebar-card';
            card.innerHTML = `
                <div class="info">
                    <h4>${power.name.en} | ${power.name.hi}</h4>
                    <p>${power.output}</p>
                </div>
            `;
            powerSection.appendChild(card);
        });
        sidebar.appendChild(powerSection);
    }

    // Crockery
    if (appState.microwave.crockery) {
        const crockerySection = document.createElement('div');
        crockerySection.className = 'sidebar-section';
        crockerySection.innerHTML = '<h3>Crockery</h3>';
        appState.microwave.crockery.forEach(item => {
            const card = document.createElement('div');
            card.className = 'sidebar-card';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name.en}" loading="lazy">
                <div class="info">
                    <h4>${item.name.en} | ${item.name.hi}</h4>
                </div>
            `;
            crockerySection.appendChild(card);
        });
        sidebar.appendChild(crockerySection);
    }

    // Buttons
    if (appState.microwave.buttons) {
        const buttonsSection = document.createElement('div');
        buttonsSection.className = 'sidebar-section';
        buttonsSection.innerHTML = '<h3>Buttons</h3>';
        appState.microwave.buttons.forEach(button => {
            const card = document.createElement('div');
            card.className = 'sidebar-card';
            card.innerHTML = `
                <img src="${button.image}" alt="${button.name.en}" loading="lazy">
                <div class="info">
                    <h4>${button.name.en} | ${button.name.hi}</h4>
                    <p>${button.info ? button.info.en : ''}</p>
                </div>
            `;
            buttonsSection.appendChild(card);
        });
        sidebar.appendChild(buttonsSection);
    }
}