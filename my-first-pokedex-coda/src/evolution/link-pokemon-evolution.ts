// add link to pokemon clicked in the evolution chain
import {getIdOfPokemonFromName} from "../utils/api.ts";
import {renderPokemon} from "../pokemon-show.ts";

export async function linkToPokemonOfEvolutionChain() {
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