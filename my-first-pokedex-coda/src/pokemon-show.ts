import './pokemon-page.ts'
import {getOnePokemonFromAPI} from './api.ts'
import {imgPokemonFromInterface} from "./get-img.ts"
import {showPokemonPaginationButtons} from "./show-pagination.ts";
import {showEvolution} from "./show-evolution.ts";

export async function renderPokemon(name: string) {
    const pokemonInformations = await getOnePokemonFromAPI(name);

    const pokemonContainer = document.getElementById('div-pokemon');

    const stat = pokemonInformations?.stats.map(pokemonStat =>
        `<p> ${pokemonStat.stat.name}: ${pokemonStat.base_stat} </p>`).join(" ");

    if (pokemonContainer) {
        pokemonContainer.innerHTML = "";

        if (pokemonInformations) {
            pokemonContainer.innerHTML += `
                <pokemon-page id="${pokemonInformations.id}" 
                              name="${pokemonInformations.name}" 
                              img="${imgPokemonFromInterface(pokemonInformations)}"
                              crie="${pokemonInformations.cries.latest}">
                   ${stat}
                </pokemon-page> `
        }
    }

    const evolutionContainer = document.createElement("p");
    evolutionContainer.setAttribute("id", 'pokemon-evolutions');
    pokemonContainer?.appendChild(evolutionContainer);

    if (pokemonInformations) {
        await showEvolution (pokemonInformations);
    }

    showPokemonPaginationButtons(name);
}
