import {nextPage, previousPage, offset} from "./pagination.ts";
import {showPokemons} from './api.ts'
import {renderPokemon} from "./pokemon-show.ts";

export async function renderPokemons () {
    const pokemonsInformations = await showPokemons(20, offset);

    const items = pokemonsInformations?.map((pokemon) => `
    <div class="pokemon-card" data-name-pokemon ="${pokemon.name}">
             <h3>${pokemon.name}</h3>
             <img src="${pokemon.sprites.front_default}" alt="Image de ${pokemon.name}"> 
     </div>`);

    const pokemonId = document.getElementById('pokemon-list');
    pokemonId!.innerHTML = items?.join(" ") ?? "";

    const divs = document.querySelectorAll('[data-name-pokemon]');
    for (const div of divs) {
        div.addEventListener('click', () => {
            renderPokemon(div.getAttribute('data-name-pokemon')!);
        })
    }
}

export function showPaginationButtons () {

    const buttonPreviousPage = document.createElement('button');
    buttonPreviousPage.innerHTML = `
<button id="previous-button">Previous</button>
`;
    document.getElementById('pagination-controls')!.appendChild(buttonPreviousPage);
    previousPage(buttonPreviousPage, () => renderPokemons());


    const buttonNextPage = document.createElement('button');
    buttonNextPage.innerHTML = `
<button id="next-button">Next</button>
`;
    document.getElementById('pagination-controls')!.appendChild(buttonNextPage);
    nextPage(buttonNextPage, () => renderPokemons());

}