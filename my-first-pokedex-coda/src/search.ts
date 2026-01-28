import {getNameOfAllPokemons, getOnePokemonFromAPI} from "./api.ts";
import {imgPokemonFromInterface} from "./get-img.ts";

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

    const arrayOfPokemon = await comparePokemonFromAll(searchValue);

    const pokemonContainer = document.getElementById('div-pokemon');

    if (pokemonContainer && arrayOfPokemon) {
        pokemonContainer.innerHTML = "";

        if (arrayOfPokemon.length == 0) {
            pokemonContainer.innerHTML += `<p>Oops! You haven't caught this pokemon yet.</p>`;
        }

        for (let name of arrayOfPokemon) {
            const pokemonInformations = await getOnePokemonFromAPI(name);

            pokemonContainer.innerHTML += `
                <pokemon-card id="${pokemonInformations?.id}" 
                              name="${pokemonInformations?.name}" 
                              img="${imgPokemonFromInterface(pokemonInformations)}">
                </pokemon-card>`
        }
    }
}

async function comparePokemonFromAll(searchValue: string) {
    const arrayOfPokemons = await getNameOfAllPokemons();

    if (searchValue && arrayOfPokemons) {
        const resultat = arrayOfPokemons.filter(name => name.toLowerCase().includes(searchValue.toLowerCase()));

    return resultat;
    }
}