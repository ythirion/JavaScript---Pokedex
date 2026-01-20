import './style.css'
import {showOnePokemon, getEvolution} from './api.ts'
import {type Evolution, type ElementOfEvolution, imgPokemon} from "./model.ts";
import {previousPokemon, nextPokemon} from "./pagination.ts";

export async function renderPokemon(id: string) {
    const pokemonInformations = await showOnePokemon(id);

    const namePokemon = pokemonInformations?.name;
    const nameUpperCase = namePokemon?.charAt(0).toUpperCase() + namePokemon!.slice(1).toLowerCase();

    const stat = pokemonInformations?.stats.map((pokemon)=>
        `<p> ${pokemon.stat.name}: ${pokemon.base_stat} </p>`).join(" ");

    const items = `
        <div>
            <img src=${imgPokemon(pokemonInformations!)} alt="Image de ${pokemonInformations?.name}" height="200">
            <p>${nameUpperCase}</p>
            <p>Id : #${pokemonInformations?.id}</p>
            <p>${stat}</p>
            <p>Crie : 
                <audio controls src="${pokemonInformations?.cries.latest}"></audio>
                <a href="${pokemonInformations?.cries.latest}">Download file</a>
            </p>
            <p id="pokemon-evolutions"></p>
        </div>
    `;

    const pokemonId = document.getElementById('div-pokemon');
    pokemonId!.innerHTML = items;


    const pokemonEvolutions = await getEvolution (pokemonInformations?.name!);

    if (pokemonEvolutions?.chain?.evolves_to && pokemonEvolutions.chain.species?.name) {
        const firstPokemon : ElementOfEvolution = {namePokemon: pokemonEvolutions.chain.species?.name, namePreviousPokemon: ""};
        const tableOfEvolution = evolutionData(pokemonEvolutions.chain.evolves_to, firstPokemon.namePokemon);
        tableOfEvolution.unshift(firstPokemon);

        const evolutionContainer = document.getElementById('pokemon-evolutions');

        let text = `Evolution: ${firstPokemon.namePokemon}`;
        let previousName = "";
        for (let i = 1; i <tableOfEvolution.length -1; i++) {
            if (tableOfEvolution[i].namePreviousPokemon == previousName) {
                text += ", " + tableOfEvolution[i].namePokemon;
            }
            else if (tableOfEvolution[i].namePreviousPokemon != previousName) {
                text += " → " + tableOfEvolution[i].namePokemon;
                previousName = tableOfEvolution[i].namePreviousPokemon;
            }
        }

        if (evolutionContainer) {
            evolutionContainer.innerHTML = text;
        }
    }

    showPokemonPaginationButtons(id);
}

export function evolutionData(pokemonEvolutions: Evolution[], previousPokemon : string) : ElementOfEvolution[] {

        let table : ElementOfEvolution[] = []
        for (const pokemon of pokemonEvolutions) {
            if (pokemon.species?.name) {
                table.push({namePokemon : pokemon.species.name, namePreviousPokemon : previousPokemon});
            }

            if (pokemon.evolves_to && pokemon.species?.name) {
                const evo = evolutionData(pokemon.evolves_to, pokemon.species.name);
                table = [...table, ...evo];
            }
        }

        return table;
}

export function showPokemonPaginationButtons (id : string) {

    const buttonPreviousPokemon = document.createElement('button');
    buttonPreviousPokemon.innerHTML = `
<button id="previous-pokemon">Previous Pokemon</button>
`;
    document.getElementById('div-pokemon')?.appendChild(buttonPreviousPokemon);

    previousPokemon(buttonPreviousPokemon, id, () => renderPokemon(buttonPreviousPokemon.getAttribute("data-id-pokemon")!));


    const buttonNextPokemon = document.createElement('button');
    buttonNextPokemon.innerHTML = `
<button id="next-button">Next Pokemon</button>
`;
    document.getElementById('div-pokemon')?.appendChild(buttonNextPokemon);

    nextPokemon(buttonNextPokemon, id, () => renderPokemon(buttonNextPokemon.getAttribute("data-id-pokemon")!));

}