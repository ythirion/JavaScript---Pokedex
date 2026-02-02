import './web-component/pokemon-page.ts'
import {getOnePokemonFromAPI} from './utils/api.ts'
import {imgPokemonFromInterface} from "./utils/get-img.ts"
import {showPokemonPaginationButtons} from "./pagination/show-pagination.ts";
import {showEvolution} from "./evolution/show-evolution.ts";

export async function renderPokemon(name: string) {
    const pokemonInformations = await getOnePokemonFromAPI(name);
    if (!pokemonInformations) return;

    const pokemonContainer = document.getElementById('div-pokemon');
    if (!pokemonContainer) return;

    pokemonContainer.innerHTML = "";

    const stat = pokemonInformations.stats.map(pokemonStat => `
        <div class="stat-row">
            <span class="stat-label">${pokemonStat.stat.name}</span>
            <progress value="${pokemonStat.base_stat}" max="200"></progress>
            <span class="stat-value">${pokemonStat.base_stat}</span>
        </div>
    `).join("");

    pokemonContainer.innerHTML += `
        <pokemon-page id="${pokemonInformations.id}" 
                      name="${pokemonInformations.name}" 
                      img="${imgPokemonFromInterface(pokemonInformations)}"
                      crie="${pokemonInformations.cries.latest}">
           ${stat}
        </pokemon-page> `

    const evolutionContainer = document.createElement("p");
    evolutionContainer.setAttribute("id", 'pokemon-evolutions');
    pokemonContainer.appendChild(evolutionContainer);

    await showEvolution(pokemonInformations);

    showPokemonPaginationButtons(name, (newName) => renderPokemon(newName));
}
