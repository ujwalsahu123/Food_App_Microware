// Render sections page
function renderSections() {
    window.scrollTo(0, 0);
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="grid" id="sections-grid"></div>';

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
    window.scrollTo(0, 0);
    const main = document.getElementById('main-content');
    main.innerHTML = '<div class="grid" id="recipes-grid"></div>';

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
    window.scrollTo(0, 0);
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
        const powerDetails = document.createElement('details');
        powerDetails.innerHTML = '<summary>Power</summary>';
        const powerContent = document.createElement('div');
        appState.microwave.power.forEach(power => {
            const subDetails = document.createElement('details');
            subDetails.innerHTML = `<summary class="power-summary">${power.name.en} | ${power.name.hi}</summary>`;

            const fullInfo = document.createElement('div');
            fullInfo.className = 'full-info';
            fullInfo.innerHTML = `
                <p><strong>Output:</strong> ${power.output}</p>
                <h4>Steps (Hindi)</h4>
                <ul>${power.steps.hi.map(step => `<li>${step}</li>`).join('')}</ul>
                <h4>Steps (English)</h4>
                <ul>${power.steps.en.map(step => `<li>${step}</li>`).join('')}</ul>
            `;

            subDetails.appendChild(fullInfo);
            powerContent.appendChild(subDetails);
        });
        powerDetails.appendChild(powerContent);
        sidebar.appendChild(powerDetails);
    }

    // Crockery
    if (appState.microwave.crockery) {
        const crockeryDetails = document.createElement('details');
        crockeryDetails.innerHTML = '<summary>Crockery</summary>';
        const crockeryContent = document.createElement('div');
        appState.microwave.crockery.forEach(item => {
            const card = document.createElement('div');
            card.className = 'sidebar-card vertical';
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name.en}" loading="lazy">
                <div class="info">
                    <h4>${item.name.en} | ${item.name.hi}</h4>
                </div>
            `;
            crockeryContent.appendChild(card);
        });
        crockeryDetails.appendChild(crockeryContent);
        sidebar.appendChild(crockeryDetails);
    }

    // Buttons
    if (appState.microwave.buttons) {
        const buttonsDetails = document.createElement('details');
        buttonsDetails.innerHTML = '<summary>Buttons</summary>';
        const buttonsContent = document.createElement('div');
        appState.microwave.buttons.forEach(button => {
            const card = document.createElement('div');
            card.className = 'sidebar-card vertical';
            card.innerHTML = `
                <img src="${button.image}" alt="${button.name.en}" loading="lazy">
                <div class="info">
                    <h4>${button.name.en} | ${button.name.hi}</h4>
                </div>
            `;

            card.addEventListener('click', () => {
                // close any other open info panels
                document.querySelectorAll('.full-info').forEach(el => {
                    if (!card.contains(el)) el.remove();
                });

                const existing = card.querySelector('.full-info');
                if (existing) {
                    existing.remove();
                    return;
                }

                const fullInfo = document.createElement('div');
                fullInfo.className = 'full-info';
                fullInfo.innerHTML = `
                    <p><strong>Info (Hindi):</strong> ${button.info.hi}</p>
                    <p><strong>Info (English):</strong> ${button.info.en}</p>
                `;

                card.appendChild(fullInfo);
            });

            buttonsContent.appendChild(card);
        });
        buttonsDetails.appendChild(buttonsContent);
        sidebar.appendChild(buttonsDetails);
    }
}

// Show full info
function showFullInfo(item, type) {
    const existing = document.querySelector('.full-info');
    if (existing) existing.remove();

    const card = event.currentTarget;
    const fullInfo = document.createElement('div');
    fullInfo.className = 'full-info';

    if (type === 'power') {
        fullInfo.innerHTML = `
            <h3>${item.name.en} | ${item.name.hi}</h3>
            <p><strong>Output:</strong> ${item.output}</p>
            <h4>Steps (English)</h4>
            <ul>${item.steps.en.map(step => `<li>${step}</li>`).join('')}</ul>
            <h4>Steps (Hindi)</h4>
            <ul>${item.steps.hi.map(step => `<li>${step}</li>`).join('')}</ul>
        `;
    } else if (type === 'button') {
        fullInfo.innerHTML = `
            <h3>${item.name.en} | ${item.name.hi}</h3>
            <p><strong>Info (English):</strong> ${item.info.en}</p>
            <p><strong>Info (Hindi):</strong> ${item.info.hi}</p>
        `;
    }

    card.appendChild(fullInfo);
}