import {renderPokemon} from "./pokemon-show.ts";

class PokemonCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const id = this.getAttribute('id');
        const name = this.getAttribute('name');
        const img = this.getAttribute('img');

        this.innerHTML = `<div class="pokemon-card" data-id-pokemon="${id}">
             <h3>#${id} ${name}</h3>
             <img src=${img} alt="Image de ${name}" 
             height="100" onerror="this.src='src/img/favicon.png'; this.onerror=null;"> 
             </div>`

        this.querySelector('[data-id-pokemon]')?.addEventListener(
            'click', () => {
                renderPokemon(this.getAttribute('id')!);
            }
        );
    }
}

window.customElements.define('pokemon-card', PokemonCard);