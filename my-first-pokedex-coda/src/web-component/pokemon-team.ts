class PokemonTeam extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'})
    }

    connectedCallback() {
        const id = this.getAttribute('id');
        const name = this.getAttribute('name');
        const img = this.getAttribute('img');

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
            <style>
                .pokemon-card {
                    background: #16222d;
                    border: 1px solid #00f2ff;
                    padding: 15px;
                    text-align: center;
                    border-radius: 10px;
                    color: white;
                    font-family: sans-serif;
                }
                img { height: 100px; object-fit: contain; }
                p { text-transform: uppercase; font-weight: bold; margin: 10px 0; }
                ::slotted(img) { height: 20px; margin: 2px; } /* Pour les icônes de types */
            </style>
            <div class="pokemon-card" id="${id}">
                <p>${name}</p>
                <img src=${img} alt="Image of ${name}" 
                height="100" onerror="this.src='src/img/favicon.png'; this.onerror=null;">
                <slot></slot>
            </div>`
        }
    }
}

window.customElements.define('pokemon-team', PokemonTeam);