const header = `
    <header>
        <a href="../index.html">
            <img src="src/img/favicon.png" alt="Logo pokeball" height="100" width="100">
        </a>
        <h1>Pokedex</h1>
        <section>
            <input type="search" id="search" placeholder="Search a pokemon by name...">
            <p id="error-message"></p>
            <input type="button" value="Search" id="searchBtn">
            <input type="button" value="Advanced Search" id="advancedSearch">
            <input type="button" value="Team" id="teamBtn">
        </section>
    </header>`

let app = document.getElementById('app');
if (app) {
    app.innerHTML = header;
}