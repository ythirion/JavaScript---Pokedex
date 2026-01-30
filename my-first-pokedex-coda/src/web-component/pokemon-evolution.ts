class PokemonEvolution extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const name = this.getAttribute('name');
        const img = this.getAttribute('img');

        this.innerHTML = `<span class='pokemon-of-evolution-chain' id="${name}">
            <img src="${img}" alt="Image of ${name}" height="70"
                onerror="this.src='src/img/favicon.png'; this.onerror=null;">
                ${name}
            </span>`
    }
}

window.customElements.define('pokemon-evolution', PokemonEvolution);