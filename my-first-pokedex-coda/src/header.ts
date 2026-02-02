const header = `
    <header>
        <div class="header-top">
            <a href="../index.html" class="logo-link">
                <img src="src/img/favicon.png" alt="Back to home page" id="main-logo">
            </a>
            <h1>Pokedex</h1>
        </div>

        <section class="search-section">
            <div class="search-row">
                <input type="search" id="search" placeholder="Search a pokemon by name...">
                <input type="button" value="Search" id="searchBtn">
            </div>
            <div class="buttons-row">
                <input type="button" value="Advanced Search" id="advancedSearch">
                <input type="button" value="Team" id="teamBtn">
            </div>
            <p id="error-message"></p>
        </section>
    </header>`;

let app = document.getElementById('app');
if (app) {
    app.innerHTML = header;
}