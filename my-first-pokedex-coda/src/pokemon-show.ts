import './style.css'
import {showOnePokemon} from './api.ts'

export async function renderPokemon(name: string) {
    const pokemonInformations = await showOnePokemon(name);

    const stat = pokemonInformations?.stats.map((pokemon)=>
        `<p> ${pokemon.stat.name}: ${pokemon.base_stat} </p>`).join(" ");

    const items = `
        <div>
            <img src="${pokemonInformations?.sprites.front_default}" alt="Image de ${pokemonInformations?.name}">
            <p>Id : #${pokemonInformations?.id}</p>
            <p>${stat}</p>
            <p>Crie : 
                <audio controls src="${pokemonInformations?.cries.latest}"></audio>
                <a href="${pokemonInformations?.cries.latest}">Download file</a>
            </p>
        </div>
    `;

    const pokemonId = document.getElementById('pokemon-show-container');
    pokemonId!.innerHTML = items;
}