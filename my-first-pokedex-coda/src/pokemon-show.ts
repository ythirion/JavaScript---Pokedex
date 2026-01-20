import './style.css'
import {showOnePokemon, getEvolution} from './api.ts'
import {type Evolution, imgPokemon} from "./model.ts";
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

    if (pokemonEvolutions?.chain?.evolves_to) {
        const firstName = pokemonEvolutions.chain.species?.name;
        const otherName = evolutionData(pokemonEvolutions.chain.evolves_to, [])

        const fullEvolutionChain = [firstName, ...otherName];

        const evolutionContainer = document.getElementById('pokemon-evolutions');
        if (evolutionContainer) {
            evolutionContainer.innerHTML = `Evolutions: ${fullEvolutionChain.join(" → ")}`;
        }
    }

    showPokemonPaginationButtons(id);
}

export function evolutionData(pokemonEvolutions: Evolution[], table: string[]) : string[] {

        for (const pokemon of pokemonEvolutions) {
            if (pokemon.species?.name) {
                table.push(pokemon.species.name);
            }

            if (pokemon.evolves_to) {
                evolutionData(pokemon.evolves_to, table);
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