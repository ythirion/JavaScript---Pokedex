class Loader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<div id="main-loader" class="loader-container">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" 
                         class="pokeball-loader" alt="Loading...">
                    <p>Catch them all...</p>
                </div>`;
    }
}

window.customElements.define('pokeball-loader', Loader);