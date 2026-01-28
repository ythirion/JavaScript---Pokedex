import './style.css'
import './header.ts'
import {renderPokemons} from "./list-show.ts";
import {search} from "./search.ts";
import {showAdvancedSearch} from "./advancedSearch.ts";
import {showTeam} from "./team.ts";


const pokemonListContainer = document.createElement('div');
pokemonListContainer.id = 'div-pokemon';

const app = document.getElementById('app');
if (app) {
    app.appendChild(pokemonListContainer);
}

await renderPokemons();
await search();
await showAdvancedSearch();
showTeam();
