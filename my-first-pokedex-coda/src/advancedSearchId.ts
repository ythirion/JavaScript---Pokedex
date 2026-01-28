import {getOnePokemonFromAPI} from "./api.ts";
import {imgPokemonFromInterface} from "./get-img.ts";

// proceed the advanced search by id when button clicked
export async function buttonSearchId () {
    const btnSearchId = document.getElementById('btnSearchId');

    btnSearchId?.addEventListener('click', () => {
        const searchId = document.getElementById('id') as HTMLInputElement;
        const searchIdValue = searchId.value;

        const searchIdValueToInt = parseInt(searchIdValue);
        if ((searchIdValueToInt > 0 && searchIdValueToInt < 1026) ||
            (searchIdValueToInt > 10000 && searchIdValueToInt < 10326)) {
            showPokemonCorrespondingToId(searchIdValue);
        } else {
            const errorMessage = document.getElementById("message-error-id");
            if (errorMessage) {
                errorMessage.innerHTML = "The id should be between 1 and 1025 or 10001 and 10325.";
            }
        }
    })
}


async function showPokemonCorrespondingToId(id: string) {

    const pokemonInformations = await getOnePokemonFromAPI(id);

    const div = document.getElementById('div-pokemon')

    if (div) {
        div.innerHTML = "";

        const item = `
                <pokemon-card id="${pokemonInformations?.id}" 
                              name="${pokemonInformations?.name}" 
                              img="${imgPokemonFromInterface(pokemonInformations)}">
                </pokemon-card>`;

        div.innerHTML += item;
    }
}