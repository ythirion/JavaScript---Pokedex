import {getGenerations, getOnePokemonFromAPI, getPokemonIdFromGen} from "../utils/api.ts";
import {imgPokemonFromInterface} from "../utils/get-img.ts";
import "../web-component/loader.ts"
import {resetFilters} from "./resetFilter.ts";

// show a checkbox for every generation of the API
export async function showGenerationCheckbox() {
    const tableOfGeneration = await getGenerations();
    if (!tableOfGeneration) return;

    let checkboxGeneration = "";
    let i = 1;

    for (let generation of tableOfGeneration) {
        checkboxGeneration += `<div class="filter-item">
                <input type='checkbox' name='gen[]' id='gen-${i}' value='${generation}' class='${i}'>
                <label for='gen-${i}'>${generation}</label>
            </div>`;
        i++;
    }

    return checkboxGeneration;
}

// proceed the advanced search by generation when button clicked
export async function buttonSearchGeneration() {
    const btnGeneration = document.getElementById('btnSearchGen');
    if (!btnGeneration) return;

    btnGeneration.addEventListener('click', async () => {
        const genCheck = document.querySelectorAll("[name = 'gen[]']:checked");
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        if (genCheck.length == 0) {
            const errorMessage = document.getElementById('no-check-box-gen');
            if (!errorMessage) return;
            errorMessage.innerHTML = "You should select at least one generation."
            return;
        }

        const tableOfGen = []
        for (let element of genCheck) {
            let id = element.getAttribute('class');
            tableOfGen.push(id);
        }

        resetFilters();

        resultsContainer.innerHTML = `<pokeball-loader></pokeball-loader>`;

        let allPokemonHTML = "";

        for (let gen of tableOfGen) {
            if (!gen) return;
            const genHTML = await showPokemonFromGen(gen);
            allPokemonHTML += genHTML;

        }

        resultsContainer.innerHTML = allPokemonHTML;
    })
}

async function showPokemonFromGen(gen: string) {
    const tableOfPokemonsId = await getPokemonIdFromGen(gen);
    if (!tableOfPokemonsId) return;

    const tableOfPokemonInfos = [];

    for (let id of tableOfPokemonsId) {
        const pokemonInformations = await getOnePokemonFromAPI(id);
        if (!pokemonInformations) return;

        tableOfPokemonInfos.push(`
            <pokemon-card id="${pokemonInformations.id}" 
                          name="${pokemonInformations.name}" 
                          img="${imgPokemonFromInterface(pokemonInformations)}">
            </pokemon-card>`);
    }

    return tableOfPokemonInfos.join('');
}