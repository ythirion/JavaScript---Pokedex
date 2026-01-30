import {nextPage, nextPokemon, previousPage, previousPokemon} from "./pagination.ts";
import {renderPokemons} from "./list-show.ts";
import {renderPokemon} from "./pokemon-show.ts";

export function showPaginationButtons() {

    const buttonPreviousPage = document.createElement('button');
    buttonPreviousPage.id = "previous-button";
    buttonPreviousPage.textContent = "Previous Page";

    document.getElementById('div-pokemon')?.appendChild(buttonPreviousPage);

    previousPage(buttonPreviousPage, () => renderPokemons());

    const buttonNextPage = document.createElement('button');
    buttonNextPage.id = "next-button";
    buttonNextPage.textContent = "Next Page";

    document.getElementById('div-pokemon')?.appendChild(buttonNextPage);

    nextPage(buttonNextPage, () => renderPokemons());
}

export function showPokemonPaginationButtons(id: string) {

    const buttonPreviousPokemon = document.createElement('button');
    buttonPreviousPokemon.id = "previous-button";
    buttonPreviousPokemon.textContent = "Previous Pokemon";

    document.getElementById('div-pokemon')?.appendChild(buttonPreviousPokemon);

    previousPokemon(buttonPreviousPokemon, id, async () => {
        const idOfPokemon = buttonPreviousPokemon.getAttribute("data-id-pokemon");
        if (!idOfPokemon) return;

        await renderPokemon(idOfPokemon);
    });

    const buttonNextPokemon = document.createElement('button');
    buttonNextPokemon.id = "next-button";
    buttonNextPokemon.textContent = "Next Pokemon";

    document.getElementById('div-pokemon')?.appendChild(buttonNextPokemon);

    nextPokemon(buttonNextPokemon, id, async () => {
        const idOfPokemon = buttonNextPokemon.getAttribute("data-id-pokemon");
        if (!idOfPokemon) return;

        await renderPokemon(idOfPokemon);
    });
}