import {offset} from "./pagination/pagination.ts";
import {getPokemonsFromAPI} from './utils/api.ts';
import {imgPokemonFromInterface} from "./utils/get-img.ts";
import {showPaginationButtons} from "./pagination/show-pagination.ts";
import './web-component/pokemon-card.ts';

export async function renderPokemons() {
    const pokemonsInformations = await getPokemonsFromAPI(20, offset);
    if (!pokemonsInformations) return;

    const pokemonContainer = document.getElementById('div-pokemon');
    if (!pokemonContainer) return;

    pokemonContainer.innerHTML = "";

    pokemonsInformations.map(pokemon => {
        pokemonContainer.innerHTML += `
            <pokemon-card id="${pokemon.id}" 
                          name="${pokemon.name}" 
                          img="${imgPokemonFromInterface(pokemon)}">
            </pokemon-card>`
    });

    showPaginationButtons(() => renderPokemons())
}