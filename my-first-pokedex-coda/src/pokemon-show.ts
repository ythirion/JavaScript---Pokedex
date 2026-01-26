import './style.css'
import './pokemon-page.ts'
import {getOnePokemonFromAPI, getEvolution, getIdOfPokemonFromName, getNameOfPokemonFromId} from './api.ts'
import {type Evolution, type ElementOfEvolution, type Pokemon} from "./model.ts";
import {imgPokemonFromInterface, imgPokemonFromId} from "./get-img.ts"
import {showPokemonPaginationButtons} from "./show-pagination.ts";
import {getIdFromUrl} from "./regex.ts";

export async function renderPokemon(id: string) {
    const pokemonInformations = await getOnePokemonFromAPI(id);

    const pokemonContainer = document.getElementById('div-pokemon');

    const stat = pokemonInformations?.stats.map((pokemon) =>
        `<p> ${pokemon.stat.name}: ${pokemon.base_stat} </p>`).join(" ");

    pokemonContainer!.innerHTML = "";

    if (pokemonInformations) {
        pokemonContainer!.innerHTML += `
            <pokemon-page id="${pokemonInformations.id}" 
                          name="${pokemonInformations.name}" 
                          img="${imgPokemonFromInterface(pokemonInformations)}"
                          crie="${pokemonInformations.cries.latest}">
               ${stat}
            </pokemon-page> `
    }

    const pEvolution = document.createElement("p");
    pEvolution.setAttribute("id", 'pokemon-evolutions');
    pokemonContainer?.appendChild(pEvolution);

    if (pokemonInformations) {
        await pokemonEvolution (pokemonInformations);
    }

    showPokemonPaginationButtons(id);

    const linkToPokemonOfEvolutionChain = document.getElementsByClassName('pokemon-of-evolution-chain');
    for (let element of linkToPokemonOfEvolutionChain) {
        if (element.getAttribute('id')) {
            const idPokemon = await getIdOfPokemonFromName(element.getAttribute('id')!);
            const idPokemonToString = idPokemon?.toString();
            element.addEventListener("click", (event) => {
                event.stopPropagation();
                renderPokemon(idPokemonToString!);
            });
        }
    }
}

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
            table = [...table, ...evo];
        }
    }

    return table;
}

async function showPokemonEvolution (firstPokemon: ElementOfEvolution, imgUrl: string, tableOfEvolution: ElementOfEvolution[]) : Promise<string> {
    let text = "";

    text = `Evolution: <span class='pokemon-of-evolution-chain' id="${firstPokemon.namePokemon}">
                        <img src="${imgUrl}" alt="Image of ${firstPokemon.namePokemon}" height="70"
                        onerror="this.src='src/img/favicon.png'; this.onerror=null;">
                        ${firstPokemon.namePokemon}
                        </span>`;

    let previousName = "";
    for (let i = 1; i < tableOfEvolution.length; i++) {

        const pokemonId = await getIdOfPokemonFromName(tableOfEvolution[i].namePokemon);
        const imgUrl = imgPokemonFromId(pokemonId!);

        if (tableOfEvolution[i].namePreviousPokemon == previousName) {
            text += ", " + `<span class="pokemon-of-evolution-chain" id="${tableOfEvolution[i].namePokemon}">`
                + `<img src="${imgUrl}" alt="Image of ${tableOfEvolution[i].namePokemon}" height="70"
                onerror="this.src='src/img/favicon.png'; this.onerror=null;">` + tableOfEvolution[i].namePokemon
                + "</span>";
        } else {
            text += " → " + `<span class="pokemon-of-evolution-chain" id="${tableOfEvolution[i].namePokemon}">`
                + `<img src="${imgUrl}" alt="Image of ${tableOfEvolution[i].namePokemon}" height="70"
                onerror="this.src='src/img/favicon.png'; this.onerror=null;">` + tableOfEvolution[i].namePokemon
                + "</span>";
            previousName = tableOfEvolution[i].namePreviousPokemon;
        }
    }

    return text;
}

async function pokemonEvolution (pokemonInformations: Pokemon) {
    const pokemonEvolutions = await getEvolution (pokemonInformations?.name!);

    if (pokemonEvolutions?.chain?.evolves_to && pokemonEvolutions.chain.species?.name) {
        const firstPokemon : ElementOfEvolution = {namePokemon: pokemonEvolutions.chain.species?.name, namePreviousPokemon: ""};
        const tableOfEvolution = await evolutionData(pokemonEvolutions.chain.evolves_to, firstPokemon.namePokemon);
        tableOfEvolution.unshift(firstPokemon);

        const evolutionContainer = document.getElementById('pokemon-evolutions');

        const pokemonId = await getIdOfPokemonFromName(firstPokemon.namePokemon);
        const imgUrl = imgPokemonFromId(pokemonId!);

        let text = await showPokemonEvolution(firstPokemon, imgUrl, tableOfEvolution);

        if (evolutionContainer) {
            evolutionContainer.innerHTML += text;
        }
    }
}