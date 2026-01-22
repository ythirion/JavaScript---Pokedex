import './style.css'
import './header.ts'
import {renderPokemons} from "./list-show.ts";
import {search} from "./search.ts";
import {advancedSearch} from "./advancedSearch.ts";


const app = document.getElementById('app')!;

const pokemonListContainer = document.createElement('div');
pokemonListContainer.id = 'div-pokemon';
app.appendChild(pokemonListContainer);



renderPokemons();

search();

advancedSearch();

