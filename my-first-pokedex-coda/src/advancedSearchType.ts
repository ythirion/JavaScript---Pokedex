import {getOnePokemonFromAPI, getPokemonIdFromType, getTypes} from "./api.ts";
import {imgPokemonFromInterface} from "./get-img.ts";

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
        if (typeCheck.length == 0) {
            const p = document.getElementById('no-check-box-type');
            if (p) {
                p.innerHTML = "You should select at least one type."
            }
        } else {
            const tableOfTypes = []
            for (let element of typeCheck) {
                let id = element.getAttribute('class');
                if (id) {
                    tableOfTypes.push(id);
                }

            }

            let div = document.getElementById('div-pokemon');
            if(div) {
                div.innerHTML = "";
            }

            if (tableOfTypes && div) {
                showPokemonFromType(tableOfTypes, div);
            }
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

async function showPokemonFromType (tableOfType: string[], div: HTMLElement) {
    const tableOfPokemonsId = await getPokemonsFromType(tableOfType);

    const tableOfPokemonInfos = [];

    if (tableOfPokemonsId.length == 0) {
        div.innerHTML = "Oops! No pokemon match to your search.";
        return;
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
    div.innerHTML += tableOfPokemonInfos.join('');
}