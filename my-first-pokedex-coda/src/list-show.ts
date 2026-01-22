import {nextPage, previousPage, offset} from "./pagination.ts";
import {showPokemons} from './api.ts'
import {renderPokemon} from "./pokemon-show.ts";
import {imgPokemonFromInterface} from "./model.ts";


export async function renderPokemons () {
    const pokemonsInformations = await showPokemons(20, offset);

    const items = pokemonsInformations?.map((pokemon) => `
    <div class="pokemon-card" data-id-pokemon="${pokemon.id}">
             <h3>#${pokemon.id} ${pokemon.name}</h3>
             <img src=${imgPokemonFromInterface(pokemon)} alt="Image de ${pokemon.name}" height="100" onerror="this.src='src/img/favicon.png'; this.onerror=null;"> 
     </div>`);

    const pokemonId = document.getElementById('div-pokemon');
    pokemonId!.innerHTML = items?.join(" ") ?? "";

    const divs = document.querySelectorAll('[data-id-pokemon]');
    for (const div of divs) {
        div.addEventListener('click', () => {
            renderPokemon(div.getAttribute('data-id-pokemon')!);
        })
    }

    showPaginationButtons ()
}

export function showPaginationButtons () {

    const buttonPreviousPage = document.createElement('button');
    buttonPreviousPage.innerHTML = `
<button id="previous-button">Previous</button>
`;
    document.getElementById('div-pokemon')!.appendChild(buttonPreviousPage);
    previousPage(buttonPreviousPage, () => renderPokemons());


    const buttonNextPage = document.createElement('button');
    buttonNextPage.innerHTML = `
<button id="next-button">Next</button>
`;
    document.getElementById('div-pokemon')!.appendChild(buttonNextPage);
    nextPage(buttonNextPage, () => renderPokemons());

}