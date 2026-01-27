import {getOnePokemonFromAPI} from "./api.ts";
import {imgPokemonFromInterface} from "./get-img.ts";
import {renderPokemon} from "./pokemon-show.ts";

export async function buttonSearchId () {
    const btnSearchId = document.getElementById('btnSearchId');
    btnSearchId?.addEventListener('click', () => {
        const searchId = document.getElementById('id') as HTMLInputElement;
        const searchIdValue = searchId.value;

        const searchIdValueToInt = parseInt(searchIdValue);
        if ((searchIdValueToInt > 0 && searchIdValueToInt < 1026) ||
            (searchIdValueToInt > 10000 && searchIdValueToInt < 10326)) {
            getPokemonCorrespondingToId(searchIdValue);
        } else {
            const errorMessage = document.getElementById("message-error-id");
            errorMessage!.innerHTML = "The id should be between 1 and 1025 or 10001 and 10325.";
        }
    })
}


async function getPokemonCorrespondingToId(id: string) {

    const pokemonInformations = await getOnePokemonFromAPI(id);

    const div = document.getElementById('div-pokemon')

    div!.innerHTML = "";

    const item = `
        <div class="pokemon-card" data-id-pokemon="${pokemonInformations?.id}">
             <h3>#${pokemonInformations?.id} ${pokemonInformations?.name}</h3>
             <img src=${imgPokemonFromInterface(pokemonInformations)} alt="Image de ${pokemonInformations?.name}" height="100"> 
         </div>
    `;

    div!.innerHTML += item;

    const divs = document.querySelectorAll('[data-id-pokemon]');
    for (const div of divs) {
        div.addEventListener('click', () => {
            renderPokemon(div.getAttribute('data-id-pokemon')!);
        })
    }
}