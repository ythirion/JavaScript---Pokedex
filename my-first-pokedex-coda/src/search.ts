import {getNameOfAllPokemons, getIdOfPokemonFromName, getOnePokemonFromAPI} from "./api.ts";
import {imgPokemonFromInterface} from "./get-img.ts";
import {renderPokemon} from "./pokemon-show.ts";

export async function search() {

    const searchButton = document.getElementById('searchBtn');

    searchButton?.addEventListener('click', () => {
        const search = document.getElementById('search') as HTMLInputElement ;
        const searchValue = search.value;

        if (searchValue.length < 3 ) {
            const errorMessage = document.getElementById('error-message');
            if (errorMessage)
            errorMessage.innerHTML = "Please enter at least 3 characters.";
        } else {
            getPokemonCorrespondingToSearch(searchValue);
        }
    })
}

async function getPokemonCorrespondingToSearch(searchValue: string) {

    const arrayOfPokemons = await getNameOfAllPokemons();

    if (searchValue && arrayOfPokemons) {
        const resultat = arrayOfPokemons.filter(name => name.toLowerCase().includes(searchValue.toLowerCase()));

        const arrayOfIdPokemon = [];
        for (let name of resultat) {
            const idOfPokemon = await getIdOfPokemonFromName(name);
            if (idOfPokemon) {
                arrayOfIdPokemon.push(idOfPokemon);
            }
        }

        const pokemonId = document.getElementById('div-pokemon');

        if (pokemonId) {
            pokemonId.innerHTML = "";

            if (arrayOfIdPokemon.length == 0) {
                pokemonId.innerHTML += `<p>Oops! You haven't caught this pokemon yet.</p>`;
            }

            for (let id of arrayOfIdPokemon) {
                const idToString = id.toString();
                const pokemonInformations = await getOnePokemonFromAPI(idToString);

                const items = `
                <div class="pokemon-card" data-id-pokemon="${pokemonInformations?.id}">
                     <h3>#${pokemonInformations?.id} ${pokemonInformations?.name}</h3>
                     <img src=${imgPokemonFromInterface(pokemonInformations)} alt="Image de ${pokemonInformations?.name}" height="100"> 
                 </div>
            `;

                pokemonId.innerHTML += items;

                const divs = document.querySelectorAll('[data-id-pokemon]');
                for (const div of divs) {
                    div.addEventListener('click', () => {
                        const idOfPokemon = div.getAttribute('data-id-pokemon');
                        if (idOfPokemon) {
                            renderPokemon(idOfPokemon);
                        }
                    })
                }
            }
        }
    }
}