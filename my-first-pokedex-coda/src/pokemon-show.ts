import './style.css'
import {showOnePokemon, getEvolution} from './api.ts'
import {imgPokemon} from "./model.ts";
import {previousPokemon, nextPokemon} from "./pagination.ts";

export async function renderPokemon(id: string) {
    const pokemonInformations = await showOnePokemon(id);

    const stat = pokemonInformations?.stats.map((pokemon)=>
        `<p> ${pokemon.stat.name}: ${pokemon.base_stat} </p>`).join(" ");

    const pokemonEvolutions = await getEvolution (pokemonInformations?.name!);

    const firstEvolution = pokemonEvolutions?.chain?.species.name;

    let firstEvolutionInformations = null;
    let secondEvolutionInformations = null;
    let thirdEvolutionInformations = null;

    if (firstEvolution) {
        firstEvolutionInformations = await showOnePokemon(firstEvolution);
    }
    const secondEvolution = pokemonEvolutions?.chain?.evolves_to?.[0].species?.name;
    if (secondEvolution) {
        secondEvolutionInformations = await showOnePokemon(secondEvolution);
    }
    const thirdEvolution = pokemonEvolutions?.chain?.evolves_to?.[0].evolves_to?.[0].species?.name;
    if (thirdEvolution) {
        thirdEvolutionInformations = await showOnePokemon(thirdEvolution);
    }





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
            <p>${firstEvolution} <img src=${imgPokemon(firstEvolutionInformations!)} alt="Image de pokemon" height="50"></p>
            <p>${secondEvolution} <img src=${imgPokemon(secondEvolutionInformations!)} alt="Image de pokemon" height="50"></p>
            <p>${thirdEvolution} <img src=${imgPokemon(thirdEvolutionInformations!)} alt="Image de pokemon" height="50"></p>
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