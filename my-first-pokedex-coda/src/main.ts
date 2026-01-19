import './style.css'
import './header.ts'
import {showPaginationButtons} from "./list-show.ts";
import {renderPokemons} from "./list-show.ts";


const app = document.getElementById('app')!;

const pokemonShowContainer = document.createElement('div');
pokemonShowContainer.id = 'pokemon-show-container';
app.appendChild(pokemonShowContainer);

const pokemonListContainer = document.createElement('div');
pokemonListContainer.id = 'pokemon-list';
pokemonShowContainer.appendChild(pokemonListContainer);

const paginationContainer = document.createElement('div');
paginationContainer.id = 'pagination-controls';
pokemonShowContainer.appendChild(paginationContainer);


renderPokemons();

showPaginationButtons()

