class Loader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <div class="loader-wrapper">
                <img src="src/img/favicon.png" class="pokedex-spinner" alt="Loading...">
                <p>Catch them all...</p>
            </div>`;
    }
}

window.customElements.define('pokeball-loader', Loader);