import './style.css'
import {showPokemons} from './api.ts'
import './header.ts'
import {offset, previousPage, nextPage} from './pagination.ts'


const app = document.getElementById('app')!;

const pokemonListContainer = document.createElement('div');
pokemonListContainer.id = 'pokemon-list';
app.appendChild(pokemonListContainer);

const paginationContainer = document.createElement('div');
paginationContainer.id = 'pagination-controls';
app.appendChild(paginationContainer);


async function renderPokemons () {
    const pokemonsInformations = await showPokemons(20, offset);


    const items = pokemonsInformations?.map((pokemon) => `
<a href = "pokemon-show?name=${pokemon.name}">
    <div id="pokemon" class="pokemon-card">
             <h3>${pokemon.name}</h3>
             <img src="${pokemon.sprites.front_default}" alt="Image de ${pokemon.name}"> 
     </div>
 </a>`);

    const pokemonId = document.getElementById('pokemon-list');
    pokemonId!.innerHTML = items?.join(" ") ?? "";

}

renderPokemons();


const buttonPreviousPage = document.createElement('button');
buttonPreviousPage.innerHTML = `
<button id="previous-button">Previous</button>
`;
document.getElementById('pagination-controls')!.appendChild(buttonPreviousPage);
previousPage(buttonPreviousPage, () => renderPokemons());


const buttonNextPage = document.createElement('button');
buttonNextPage.innerHTML = `
<button id="next-button">Next</button>
`;
document.getElementById('pagination-controls')!.appendChild(buttonNextPage);
nextPage(buttonNextPage, () => renderPokemons());

