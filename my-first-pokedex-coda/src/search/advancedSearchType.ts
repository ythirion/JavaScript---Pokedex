import {getOnePokemonFromAPI, getPokemonIdFromType, getTypes} from "../utils/api.ts";
import {imgPokemonFromInterface} from "../utils/get-img.ts";
import "../web-component/loader.ts"
import {resetFilters} from "./resetFilter.ts";

// show a checkbox for every type of the API
export async function showTypeCheckbox() {
    const tableOfTypes = await getTypes();
    if (!tableOfTypes) return;

    let checkboxTypes = "";
    let j = 1;


    for (let type of tableOfTypes) {
        //API non mis à jour, aucun pokemon de type unknown ou stellar
        if (type !== "stellar" && type !== "unknown")
            checkboxTypes += `<div class="filter-item">
                <input type='checkbox' name='types[]' class='${j}' id="type-${type}">
                <label for="type-${type}">${type}</label>
            </div>`;
        j++;
    }

    return checkboxTypes;
}

// proceed the advanced search by type when button clicked
export async function buttonSearchType() {
    const btnType = document.getElementById('btnSearchTypes');
    if (!btnType) return;

    btnType.addEventListener('click', async () => {
        const typeCheck = document.querySelectorAll("[name = 'types[]']:checked");
        const resultsContainer = document.getElementById('search-results');
        if (!resultsContainer) return;

        if (typeCheck.length === 0) {
            const errorMessage = document.getElementById('no-check-box-type');
            if (!errorMessage) return;
            errorMessage.innerHTML = "You should select at least one type.";
            return;
        }

        const tableOfTypes: string[] = []
        if (!tableOfTypes) return;

        for (let element of typeCheck) {
            let id = element.getAttribute('class');
            if (!id) return;

            tableOfTypes.push(id);
        }

        resetFilters();

        resultsContainer.innerHTML = `<pokeball-loader></pokeball-loader>`;

        let allPokemonHTML = "";

        const typeHTML = await showPokemonFromType(tableOfTypes);
        allPokemonHTML += typeHTML;

        resultsContainer.innerHTML = allPokemonHTML;
    })
}

// get each pokemon of type checked. If multiple type checked, only pokemon of multi types corresponding
async function getPokemonsFromType (tableOfTypes: string[]) {
    const tableOfPokemonsId = [];

    for (let type of tableOfTypes) {
        const response = await getPokemonIdFromType(type);
        if (!response) return;

        tableOfPokemonsId.push(response);
    }

    if (tableOfPokemonsId.length > 2) {
        return [];
    }

    const tableFlat = tableOfPokemonsId.flat();

    if (tableOfPokemonsId.length === 1) {
        return tableFlat;
    }

    const result = new Set<string>();

    for (let id of tableFlat) {
        const tableFilter = tableFlat.filter((curr) => curr === id);
        if (tableFilter.length === 2) {
            result.add(id);
        }
    }

    const tableOfResult = Array.from(result);

    return tableOfResult;
}

async function showPokemonFromType(tableOfType: string[]) {
    const tableOfPokemonsId = await getPokemonsFromType(tableOfType);
    if (!tableOfPokemonsId) return;

    const tableOfPokemonInfos = [];

    if (tableOfPokemonsId.length == 0) {
        return "Oops! No pokemon match to your search.";
    }

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