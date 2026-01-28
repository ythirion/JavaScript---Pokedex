import {getEvolution, getIdOfPokemonFromName, getNameOfPokemonFromId} from './api.ts'
import {type Evolution, type ElementOfEvolution, type Pokemon} from "./model.ts";
import "./pokemon-evolution.ts"
import {imgPokemonFromId} from "./get-img.ts"
import {getIdFromUrl} from "./regex.ts";
import {renderPokemon} from "./pokemon-show.ts";

// get information of the evolution chain to give to renderPokemon function
export async function showEvolution (pokemonInformations: Pokemon) {
    if (pokemonInformations.name) {
        const pokemonEvolutions = await getEvolution (pokemonInformations?.name);

        if (pokemonEvolutions?.chain?.evolves_to && pokemonEvolutions.chain.species?.url) {
            const idOfFirstPokemon = getIdFromUrl(pokemonEvolutions.chain.species?.url);
            if (idOfFirstPokemon) {
                const nameOfFirstPokemon = await getNameOfPokemonFromId(idOfFirstPokemon);

                if (nameOfFirstPokemon) {
                    const firstPokemon : ElementOfEvolution = {namePokemon: nameOfFirstPokemon, namePreviousPokemon: ""};
                    const tableOfEvolution = await evolutionData(pokemonEvolutions.chain.evolves_to, firstPokemon.namePokemon);
                    tableOfEvolution.unshift(firstPokemon);

                    const evolutionContainer = document.getElementById('pokemon-evolutions');

                    const idOfFirstPokemonToInt = parseInt(idOfFirstPokemon);
                    if (idOfFirstPokemonToInt) {
                        const imgUrl = imgPokemonFromId(idOfFirstPokemonToInt);
                        let text = await showPokemonEvolution(firstPokemon, imgUrl, tableOfEvolution);

                        if (evolutionContainer) {
                            evolutionContainer.innerHTML += text;
                        }
                    }
                    await linkToPokemonOfEvolutionChain()
                }
            }
        }
    }
}

// construct a table of informations for the evolution chain (previous pokemon / pokemon)
export async function evolutionData(pokemonEvolutions: Evolution[], previousPokemon : string) : Promise<ElementOfEvolution[]> {
    let table : ElementOfEvolution[] = []
    for (const pokemon of pokemonEvolutions) {
        if (pokemon.species?.name && pokemon.species?.url) {
            const idOfPokemon = getIdFromUrl(pokemon.species?.url);
            if (idOfPokemon) {
                const namePokemon = await getNameOfPokemonFromId(idOfPokemon);
                if (namePokemon) {
                    table.push({namePokemon : namePokemon, namePreviousPokemon : previousPokemon});
                }
            }
        }

        if (pokemon.evolves_to && pokemon.species?.name) {
            const evo = await evolutionData(pokemon.evolves_to, pokemon.species.name);
            table.push(...evo);
        }
    }

    return table;
}

async function showPokemonEvolution (firstPokemon: ElementOfEvolution, imgUrl: string, tableOfEvolution: ElementOfEvolution[]) : Promise<string> {
    let text = `Evolution: <pokemon-evolution name="${firstPokemon.namePokemon}" img="${imgUrl}">
                        </pokemon-evolution>`;

    let previousName = "";
    for (let i = 1; i < tableOfEvolution.length; i++) {

        const pokemonId = await getIdOfPokemonFromName(tableOfEvolution[i].namePokemon);
        if (pokemonId) {
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
    }

    return text;
}

// add link to pokemon clicked in the evolution chain
async function linkToPokemonOfEvolutionChain() {
    const linkToPokemonOfEvolutionChain = document.getElementsByClassName('pokemon-of-evolution-chain');
    for (let element of linkToPokemonOfEvolutionChain) {
        const nameOfElement = element.getAttribute('id');
        if (nameOfElement) {
            const idPokemon = await getIdOfPokemonFromName(nameOfElement);
            const idPokemonToString = idPokemon?.toString();
            element.addEventListener("click", () => {
                if (idPokemonToString) {
                    renderPokemon(idPokemonToString);
                }
            });
        }
    }
}