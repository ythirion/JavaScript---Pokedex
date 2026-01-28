import {offset} from "./pagination.ts";
import {getPokemonsFromAPI} from './api.ts'
import {imgPokemonFromInterface} from "./get-img.ts";
import {showPaginationButtons} from "./show-pagination.ts";
import "./pokemon-card.ts"



export async function renderPokemons () {
    const pokemonsInformations = await getPokemonsFromAPI(20, offset);

    const pokemonContainer = document.getElementById('div-pokemon');

    if (pokemonContainer) {
        pokemonContainer.innerHTML = "";

        pokemonsInformations?.map( pokemon => {
            pokemonContainer.innerHTML += `
                <pokemon-card id="${pokemon.id}" 
                              name="${pokemon.name}" 
                              img="${imgPokemonFromInterface(pokemon)}">
                </pokemon-card>`
                });
    }

    showPaginationButtons ()
}