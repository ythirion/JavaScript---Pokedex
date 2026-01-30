class PokemonPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const id = this.getAttribute('id');
        const name = this.getAttribute('name');
        const img = this.getAttribute('img');
        const crie  = this.getAttribute('crie');

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `<div class="pokemon-page" data-id-pokemon="${id}">
                <img src=${img} alt="Image de ${name}" 
                height="200" onerror="this.src='src/img/favicon.png'; this.onerror=null;">
                <p>${name}</p>
                <p>Id : #${id}</p>
                <slot></slot>
                <p>Crie : 
                    <audio controls src="${crie}"></audio>
                    <a href="${crie}">Download file</a>
                </p>
            </div>`
        }
    }
}

window.customElements.define('pokemon-page', PokemonPage);