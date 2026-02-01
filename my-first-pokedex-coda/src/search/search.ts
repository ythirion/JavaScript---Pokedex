import {getNameOfAllPokemons, getOnePokemonFromAPI} from "../utils/api.ts";
import {imgPokemonFromInterface} from "../utils/get-img.ts";

export function search() {
    const searchButton = document.getElementById('searchBtn');
    if (!searchButton) return;

    searchButton.addEventListener('click', async () => {
        const search = document.getElementById('search') as HTMLInputElement;
        const searchValue = search.value;

        if (searchValue.length < 3) {
            const errorMessage = document.getElementById('error-message');
            if (!errorMessage) return;

            errorMessage.innerHTML = "Please enter at least 3 characters.";
        } else {
            await getPokemonCorrespondingToSearch(searchValue);
        }
    })
}

async function getPokemonCorrespondingToSearch(searchValue: string) {
    const arrayOfPokemon = await comparePokemonFromAll(searchValue);
    if (!arrayOfPokemon) return;

    const pokemonContainer = document.getElementById('div-pokemon');
    if (!pokemonContainer) return;

    pokemonContainer.innerHTML = "";

    if (arrayOfPokemon.length == 0) {
        pokemonContainer.innerHTML += `<p>Oops! You haven't caught this pokemon yet.</p>`;
    }

    for (let name of arrayOfPokemon) {
        const pokemonInformations = await getOnePokemonFromAPI(name);
        if (!pokemonInformations) return;

        pokemonContainer.innerHTML += `
            <pokemon-card id="${pokemonInformations.id}" 
                          name="${pokemonInformations.name}" 
                          img="${imgPokemonFromInterface(pokemonInformations)}">
            </pokemon-card>`
    }
}

export async function comparePokemonFromAll(searchValue: string) {
    const arrayOfPokemons = await getNameOfAllPokemons();
    if (!arrayOfPokemons) return;

    const resultat = arrayOfPokemons.filter(name => name.toLowerCase().includes(searchValue.toLowerCase()));
    return resultat;
}