import {getOnePokemonFromAPI, getPokemonIdFromType, getTypes} from "./api.ts";
import {imgPokemonFromInterface} from "./get-img.ts";
import "./loader.ts"

// show a checkbox for every type of the API
export async function showTypeCheckbox() {
    const tableOfTypes = await getTypes();

    let checkboxTypes = "";
    let j = 1;

    for (let type of tableOfTypes!) {
        //API non mis à jour, aucun pokemon de type unknown ou stellar
        if (type !== "stellar" && type !== "unknown")
            checkboxTypes += `<input type='checkbox' name='types[]' class='${j}'>` + type + "</input>";
        j++;
    }

    return checkboxTypes;
}

// proceed the advanced search by type when button clicked
export async function buttonSearchType() {
    const btnType = document.getElementById('btnSearchTypes');
    btnType?.addEventListener('click', async () => {
        const typeCheck = document.querySelectorAll("[name = 'types[]']:checked");
        let div = document.getElementById('div-pokemon');
        if (typeCheck.length == 0) {
            const errorMessage = document.getElementById('no-check-box-type');
            if (errorMessage) {
                errorMessage.innerHTML = "You should select at least one type."
                return;
            }
        }

        if(div) {
            div.innerHTML = `<pokeball-loader></pokeball-loader>`;
        }

        const tableOfTypes = []
        for (let element of typeCheck) {
            let id = element.getAttribute('class');
            if (id) {
                tableOfTypes.push(id);
            }

        }

        let allPokemonHTML = "";

        if (tableOfTypes && div) {
            const typeHTML = await showPokemonFromType(tableOfTypes);
            allPokemonHTML += typeHTML;
        }

        if (div) {
            div.innerHTML = allPokemonHTML;
        }
    })
}

// get each pokemon of type checked. If multiple type checked, only pokemon of multi types corresponding
async function getPokemonsFromType (tableOfTypes: string[]) {
    const tableOfPokemonsId = [];

    for (let type of tableOfTypes) {
        const response = await getPokemonIdFromType(type);
        if (response) {
            tableOfPokemonsId.push(response);
        }
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

async function showPokemonFromType (tableOfType: string[]) {
    const tableOfPokemonsId = await getPokemonsFromType(tableOfType);

    const tableOfPokemonInfos = [];

    if (tableOfPokemonsId.length == 0) {
        return "Oops! No pokemon match to your search.";
    }

    if (tableOfPokemonsId) {
        for (let id of tableOfPokemonsId) {
            const pokemonInformations = await getOnePokemonFromAPI(id);

            tableOfPokemonInfos.push( `
                    <pokemon-card id="${pokemonInformations?.id}"
                                  name="${pokemonInformations?.name}"
                                  img="${imgPokemonFromInterface(pokemonInformations)}">
                    </pokemon-card>`);
        }
    }
    return tableOfPokemonInfos.join('');
}