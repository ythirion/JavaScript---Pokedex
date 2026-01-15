import './style.css'
import {showPokemons} from './api.ts'


const param = new URLSearchParams(window.location.search);
let offset = parseInt(param.get('offset')?? "0");

const limit = 20;
const totalPokemon = 1350;

let previous = 0;
let next = 0;

if (offset <= 0) {
    previous = totalPokemon - (totalPokemon % limit);
} else {
    previous = offset - limit;
}

if (offset >= totalPokemon - limit) {
    next = 0;
} else {
    next = offset + limit;
}

const paginationButton = `
    <a href="index.html?limit=20&offset=${previous}">Previous</a>
    <a href="index.html?limit=20&offset=${next}">Next</a>
`
const pagination = document.getElementById('pagination');
pagination!.innerHTML = paginationButton;


const pokemonsInformations = await showPokemons(20, offset);


const items = pokemonsInformations?.map((pokemon)=> `
<a href = "pokemon-show?name=${pokemon.name}">
    <div id="pokemon" class="pokemon-card">
             <h3>${pokemon.name}</h3>
             <img src="${pokemon.sprites.front_default}" alt="Image de ${pokemon.name}"> 
     </div>
 </a>`);

const pokemonId = document.getElementById('pokemon-list');
pokemonId!.innerHTML = items?.join(" ");