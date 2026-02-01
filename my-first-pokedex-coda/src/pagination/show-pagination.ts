import {nextPage, nextPokemon, previousPage, previousPokemon} from "./pagination.ts";

export function showPaginationButtons(onPageChange: () => void) {

    const buttonPreviousPage = document.createElement('button');
    buttonPreviousPage.id = "previous-button";
    buttonPreviousPage.textContent = "Previous Page";

    const divContainer = document.getElementById('div-pokemon');
    if (!divContainer) return;
    divContainer.appendChild(buttonPreviousPage);

    previousPage(buttonPreviousPage, onPageChange);

    const buttonNextPage = document.createElement('button');
    buttonNextPage.id = "next-button";
    buttonNextPage.textContent = "Next Page";

    divContainer.appendChild(buttonNextPage);

    nextPage(buttonNextPage, onPageChange);
}

export function showPokemonPaginationButtons(id: string, onNavigate: (targetId: string) => Promise<void>) {

    const buttonPreviousPokemon = document.createElement('button');
    buttonPreviousPokemon.id = "previous-button";
    buttonPreviousPokemon.textContent = "Previous Pokemon";

    const divContainer = document.getElementById('div-pokemon')
    if (!divContainer) return;
    divContainer.appendChild(buttonPreviousPokemon);

    previousPokemon(buttonPreviousPokemon, id, async () => {
        const idOfPokemon = buttonPreviousPokemon.getAttribute("data-id-pokemon");
        if (!idOfPokemon) return;

        await onNavigate(idOfPokemon);
    });

    const buttonNextPokemon = document.createElement('button');
    buttonNextPokemon.id = "next-button";
    buttonNextPokemon.textContent = "Next Pokemon";

    divContainer.appendChild(buttonNextPokemon);

    nextPokemon(buttonNextPokemon, id, async () => {
        const idOfPokemon = buttonNextPokemon.getAttribute("data-id-pokemon");
        if (!idOfPokemon) return;

        await onNavigate(idOfPokemon);
    });
}