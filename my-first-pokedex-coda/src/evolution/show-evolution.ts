import {getEvolution, getIdOfPokemonFromName, getNameOfPokemonFromId} from '../utils/api.ts'
import {type Evolution, type ElementOfEvolution, type Pokemon} from "../utils/model.ts";
import "../web-component/pokemon-evolution.ts"
import {imgPokemonFromId} from "../utils/get-img.ts"
import {getIdFromUrl} from "../utils/regex.ts";
import {renderPokemon} from "../pokemon-show.ts";

// get information of the evolution chain to give to renderPokemon function
export async function showEvolution(pokemonInformations: Pokemon) {
    if (!pokemonInformations.name) return;

    const pokemonEvolutions = await getEvolution(pokemonInformations.name);
    if (!pokemonEvolutions) return;

    if (pokemonEvolutions.chain?.evolves_to && pokemonEvolutions.chain.species?.url) {
        const idOfFirstPokemon = getIdFromUrl(pokemonEvolutions.chain.species.url);
        if (!idOfFirstPokemon) return;

        const nameOfFirstPokemon = await getNameOfPokemonFromId(idOfFirstPokemon);
        if (!nameOfFirstPokemon) return;

        const firstPokemon: ElementOfEvolution = {namePokemon: nameOfFirstPokemon, namePreviousPokemon: ""};

        const tableOfEvolution = await evolutionData(pokemonEvolutions.chain.evolves_to, firstPokemon.namePokemon);
        tableOfEvolution.unshift(firstPokemon);

        const evolutionContainer = document.getElementById('pokemon-evolutions');
        if (!evolutionContainer) return;

        const idOfFirstPokemonToInt = parseInt(idOfFirstPokemon);
        if (!idOfFirstPokemonToInt) return;

        const imgUrl = imgPokemonFromId(idOfFirstPokemonToInt);
        let text = await showPokemonEvolution(firstPokemon, imgUrl, tableOfEvolution);

        evolutionContainer.innerHTML += text;

        await linkToPokemonOfEvolutionChain()
    }
}

// construct a table of informations for the evolution chain (previous pokemon / pokemon)
export async function evolutionData(pokemonEvolutions: Evolution[], previousPokemon: string): Promise<ElementOfEvolution[]> {
    let table: ElementOfEvolution[] = []

    for (const pokemon of pokemonEvolutions) {
        if (pokemon.species?.name && pokemon.species?.url) {
            const idOfPokemon = getIdFromUrl(pokemon.species.url);
            if (!idOfPokemon) return [];

            const namePokemon = await getNameOfPokemonFromId(idOfPokemon);
            if (!namePokemon) return [];

            table.push({namePokemon: namePokemon, namePreviousPokemon: previousPokemon});
        }

        if (pokemon.evolves_to && pokemon.species?.name) {
            const evo = await evolutionData(pokemon.evolves_to, pokemon.species.name);
            table.push(...evo);
        }
    }
    return table;
}

async function showPokemonEvolution(firstPokemon: ElementOfEvolution, imgUrl: string, tableOfEvolution: ElementOfEvolution[]): Promise<string> {
    let text = `Evolution: <pokemon-evolution name="${firstPokemon.namePokemon}" img="${imgUrl}"></pokemon-evolution>`;

    let previousName = "";
    for (let i = 1; i < tableOfEvolution.length; i++) {

        const pokemonId = await getIdOfPokemonFromName(tableOfEvolution[i].namePokemon);
        if (!pokemonId) return text;

        const imgUrl = imgPokemonFromId(pokemonId);

        if (tableOfEvolution[i].namePreviousPokemon == previousName) {
            text += ", " + `<pokemon-evolution name="${tableOfEvolution[i].namePokemon}" img="${imgUrl}">
            </pokemon-evolution>`;
        } else {
            text += " → " + `<pokemon-evolution name="${tableOfEvolution[i].namePokemon}" img="${imgUrl}">
            </pokemon-evolution>`;
            previousName = tableOfEvolution[i].namePreviousPokemon;
        }
    }
    return text;
}

// add link to pokemon clicked in the evolution chain
async function linkToPokemonOfEvolutionChain() {
    const linkToPokemonOfEvolutionChain = document.getElementsByClassName('pokemon-of-evolution-chain');
    for (let element of linkToPokemonOfEvolutionChain) {
        const nameOfElement = element.getAttribute('id');
        if (!nameOfElement) return;

        const idPokemon = await getIdOfPokemonFromName(nameOfElement);
        if (!idPokemon) return;

        const idPokemonToString = idPokemon.toString();
        if (!idPokemonToString) return;

        element.addEventListener("click", () => {
            renderPokemon(idPokemonToString);
        });
    }
}