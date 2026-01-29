class PokemonTeam extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' })

    }

    connectedCallback() {
        const id = this.getAttribute('id');
        const name = this.getAttribute('name');
        const img = this.getAttribute('img');
        const i = this.getAttribute('i');

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `<div class="pokemon-card" id="${id}">
                            <p>${name}</p>
                            <img src="${img}" alt="img of pokemon" height="100">
                            <slot></slot>
                            <button type="button" data-pokemon-id="pokemon_${i}">Change pokemon</button>
                        </div>`
        }
    }
}

window.customElements.define('pokemon-team', PokemonTeam);