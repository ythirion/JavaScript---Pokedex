import {getGenerations, getTypes, showOnePokemon} from "./api.ts";
import {imgPokemonFromInterface} from "./model.ts";
import {renderPokemon} from "./pokemon-show.ts";


export async function advancedSearch() {
    const tableOfTypes = await getTypes();

    let checkboxTypes = "";

    for (let type of tableOfTypes!) {
        //API non mis à jour, aucun pokemon de type unknown ou stellar
        if (type !== "stellar" && type !== "unknown")
        checkboxTypes += "<input type='checkbox' name='types[]' >" + type +"</input>";
    }

    const tableOfGeneration = await getGenerations();

    let checkboxGeneration = "";

    for (let generation of tableOfGeneration!) {
        checkboxGeneration += "<input type='checkbox' name='types[]' >" + generation +"</input>";
    }

    const advancedSearchButton = document.getElementById('advancedSearch');

    advancedSearchButton?.addEventListener('click', () => {
        const page = document.getElementById('div-pokemon');
        page!.innerHTML = "";

        page!.innerHTML += `
            <h2>Advanced Search</h2>
            <h3>Id Pokemon</h3>
            <label for="id">Id of Pokemon</label>
            <input type="number" name="id" id="id">
            <input type="button" value="Search" id="btnSearchId">
            <p id="message-error-id"></p>
            <h3>Types</h3>
            ${checkboxTypes}
            <input type="button" value="Search" id="btnSearchTypes">
            <h3>Abilities</h3>
            <!--à voir plus tard quand on aura la foi-->
            <input type="button" value="Search" id="btnSearchAbilities">
            <h3>Generations</h3>
            ${checkboxGeneration}
            <input type="button" value="Search" id="btnSearchGen">
`


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
    })
}

async function getPokemonCorrespondingToId(id: string) {

    const pokemonInformations = await showOnePokemon(id);

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
