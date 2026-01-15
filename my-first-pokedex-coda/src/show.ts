import './style.css'
import {showOnePokemon} from './api.ts'

const param = new URLSearchParams(window.location.search);
const name = param.get('name');

const pokemonInformations = await showOnePokemon(name);
const stat = pokemonInformations?.stats.map((pokemon)=>
    `<p> ${pokemon.stat.name}: ${pokemon.base_stat} </p>`).join(" ");

const div = `
<div>
    <img src="${pokemonInformations?.sprites.front_default}" alt="Image de ${pokemonInformations?.name}">
    <p>Id : #${pokemonInformations?.id}</p>
    <p>${stat}</p>
    <p>Crie : ${pokemonInformations?.cries.latest}</p>
</div>
`;

let pokemonInfos = document.getElementById('pokemon-show');
pokemonInfos!.innerHTML = div;

if (name) {
    document.querySelector('title').textContent = "Pokedex - " + name;
    document.querySelector('h2').textContent = name;
}
