import {getGenerations, getOnePokemonFromAPI, getPokemonIdFromGen} from "./api.ts";
import {imgPokemonFromInterface} from "./get-img.ts";
import "./loader.ts"

// show a checkbox for every generation of the API
export async function showGenerationCheckbox() {
    const tableOfGeneration = await getGenerations();

    let checkboxGeneration = "";
    let i = 1;

    for (let generation of tableOfGeneration!) {
        checkboxGeneration += `<input type='checkbox' name='gen[]' id='${i}'>` + generation + "</input>";
        i++;
    }

    return checkboxGeneration;
}

// proceed the advanced search by generation when button clicked
export async function buttonSearchGeneration() {
    const btnGeneration = document.getElementById('btnSearchGen');
    btnGeneration?.addEventListener('click', async () => {
        const genCheck = document.querySelectorAll("[name = 'gen[]']:checked");
        let div = document.getElementById('div-pokemon');
        if (genCheck.length == 0) {
            const errorMessage = document.getElementById('no-check-box-gen');
            if (errorMessage) {
                errorMessage.innerHTML = "You should select at least one generation."
                return;
            }
        }

        if (div) {
            div.innerHTML = `<pokeball-loader></pokeball-loader>`;
        }

        const tableOfGen = []
        for (let element of genCheck) {
            let id = element.getAttribute('id');
            tableOfGen.push(id);
        }

        let allPokemonHTML = "";

        for (let gen of tableOfGen) {
            if (gen) {
                const genHTML = await showPokemonFromGen(gen);
                allPokemonHTML += genHTML;
            }
        }

        if (div) {
            div.innerHTML = allPokemonHTML;
        }
    })
}

async function showPokemonFromGen (gen:string) {
    const tableOfPokemonsId = await getPokemonIdFromGen(gen);

    const tableOfPokemonInfos = [];

    if (tableOfPokemonsId) {
        for (let id of tableOfPokemonsId!) {
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