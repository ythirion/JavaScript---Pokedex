const header = `
<header>
    <a href="index.html">
        <img src="src/img/favicon.png" alt="Logo pokeball" height="100" width="100">
    </a>
    <h1>Pokedex</h1>
    <section>
        <input type="search" id="search" placeholder="Search...">
        <p id="error-message"></p>
        <input type="button" value="Search" id="searchBtn">
    </section>
</header>
`
let headerHTML = document.getElementById('app');
headerHTML!.innerHTML = header;