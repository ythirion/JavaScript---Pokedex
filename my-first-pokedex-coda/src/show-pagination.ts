import {nextPage, nextPokemon, previousPage, previousPokemon} from "./pagination.ts";
import {renderPokemons} from "./list-show.ts";
import {renderPokemon} from "./pokemon-show.ts";

export function showPaginationButtons () {

    const buttonPreviousPage = document.createElement('button');
    buttonPreviousPage.innerHTML = `
    <button id="previous-button">Previous</button>
    `;

    const divPokemon = document.getElementById('div-pokemon');
    if (divPokemon) {
        divPokemon.appendChild(buttonPreviousPage);
    }

    previousPage(buttonPreviousPage, () => renderPokemons());

    const buttonNextPage = document.createElement('button');
    buttonNextPage.innerHTML = `
    <button id="next-button">Next</button>
    `;
    if (divPokemon) {
        divPokemon.appendChild(buttonNextPage);
    }

    nextPage(buttonNextPage, () => renderPokemons());

}

export function showPokemonPaginationButtons (id : string) {

    const buttonPreviousPokemon = document.createElement('button');
    buttonPreviousPokemon.innerHTML = `
    <button id="previous-pokemon">Previous Pokemon</button>
    `;

    document.getElementById('div-pokemon')?.appendChild(buttonPreviousPokemon);

    previousPokemon(buttonPreviousPokemon, id, async () => {
        const idOfPokemon = buttonPreviousPokemon.getAttribute("data-id-pokemon");
        if (idOfPokemon) {
            await renderPokemon(idOfPokemon);
        }
    });

    const buttonNextPokemon = document.createElement('button');
    buttonNextPokemon.innerHTML = `
    <button id="next-button">Next Pokemon</button>
    `;

    document.getElementById('div-pokemon')?.appendChild(buttonNextPokemon);

    nextPokemon(buttonNextPokemon, id, async () => {
        const idOfPokemon = buttonNextPokemon.getAttribute("data-id-pokemon");
        if (idOfPokemon) {
            await renderPokemon(idOfPokemon);
        }
    });
}