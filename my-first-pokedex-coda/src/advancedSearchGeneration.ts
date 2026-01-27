import {getGenerations, getOnePokemonFromAPI, getPokemonIdFromGen} from "./api.ts";
import {imgPokemonFromInterface} from "./get-img.ts";

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

export async function buttonSearchGeneration() {
    const btnGeneration = document.getElementById('btnSearchGen');
    btnGeneration?.addEventListener('click', async () => {
        const genCheck = document.querySelectorAll("[name = 'gen[]']:checked");
        if (genCheck.length == 0) {
            const p = document.getElementById('no-check-box-gen');
            if (p) {
                p.innerHTML = "You should select at least one generation."
            }
        } else {
            const tableOfGen = []
            for (let element of genCheck) {
                let id = element.getAttribute('id');
                tableOfGen.push(id);
            }

            let div = document.getElementById('div-pokemon');
            if(div) {
                div.innerHTML = "";
            }

            for (let gen of tableOfGen) {
                if (div && gen) {
                    await getPokemonFromGen(gen, div);
                }
            }
        }
    })
}

async function getPokemonFromGen (gen:string, div:HTMLElement) {
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

    div.innerHTML += tableOfPokemonInfos.join('');
}