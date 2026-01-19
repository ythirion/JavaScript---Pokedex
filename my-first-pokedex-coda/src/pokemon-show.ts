import './style.css'
import {showOnePokemon, getEvolution} from './api.ts'
import {imgPokemon} from "./model.ts";
import {previousPokemon, nextPokemon} from "./pagination.ts";

export async function renderPokemon(id: string) {
    const pokemonInformations = await showOnePokemon(id);

    const stat = pokemonInformations?.stats.map((pokemon)=>
        `<p> ${pokemon.stat.name}: ${pokemon.base_stat} </p>`).join(" ");

    const pokemonEvolutions = await getEvolution (pokemonInformations?.name!);

    const items = `
        <div>
            <img src=${imgPokemon(pokemonInformations!)} alt="Image de ${pokemonInformations?.name}" height="200" alt="Image de ${pokemonInformations?.name}">
            <p>${pokemonInformations?.name}</p>
            <p>Id : #${pokemonInformations?.id}</p>
            <p>${stat}</p>
            <p>Crie : 
                <audio controls src="${pokemonInformations?.cries.latest}"></audio>
                <a href="${pokemonInformations?.cries.latest}">Download file</a>
            </p>
            <p>${pokemonEvolutions?.chain?.species.name}</p>
            <p>${pokemonEvolutions?.chain?.evolves_to?.[0].species?.name}</p>
            <p>${pokemonEvolutions?.chain?.evolves_to?.[0].evolves_to?.[0].species?.name}</p>
        </div>
    `;

    const pokemonId = document.getElementById('div-pokemon');
    pokemonId!.innerHTML = items;

    showPokemonPaginationButtons(id);
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