import './style.css'
import {showPokemons} from './api.ts'


const pokemonsInformations = await showPokemons();


const items = pokemonsInformations?.map((pokemon)=> `
<div id="pokemon">
    <a href = "pokemon-show?name=${pokemon.name}">
         <h3>${pokemon.name}</h3>
         <img src="${pokemon.sprites.front_default}" alt="Image de ${pokemon.name}">
     </a>
 </div>`);

let pokemonId = document.getElementById('pokemon-list');
pokemonId!.innerHTML = items?.join(" ");

