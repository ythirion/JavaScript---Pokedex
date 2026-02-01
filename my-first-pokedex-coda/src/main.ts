import './css/style.css'
import './header.ts'
import {renderPokemons} from "./list-show.ts";
import {search} from "./search/search.ts";
import {showAdvancedSearch} from "./search/advancedSearch.ts";
import {showTeam} from "./team/team.ts";

const pokemonListContainer = document.createElement('div');
pokemonListContainer.id = 'div-pokemon';

const app = document.getElementById('app');
if (app) {
    app.appendChild(pokemonListContainer);
}

await renderPokemons();
search();
await showAdvancedSearch();
showTeam();
