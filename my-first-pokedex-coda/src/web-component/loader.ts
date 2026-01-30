class Loader extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<div id="main-loader" class="loader-container">
                            <img src="src/img/loader.png" class="pokeball-loader" alt="Loading...">
                            <p>Catch them all...</p>
                         </div>`;
    }
}

window.customElements.define('pokeball-loader', Loader);