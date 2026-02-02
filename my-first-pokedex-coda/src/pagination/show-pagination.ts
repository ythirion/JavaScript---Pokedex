import {nextPage, nextPokemon, previousPage, previousPokemon} from "./pagination.ts";

export function showPaginationButtons(onPageChange: () => void) {
    const divContainer = document.getElementById('div-pokemon');
    if (!divContainer) return;

    const wrapper = document.createElement('div');
    wrapper.className = "pagination-wrapper";
    wrapper.innerHTML = `
        <button id="previous-button">Previous Page</button>
        <button id="next-button">Next Page</button>
    `;

    divContainer.appendChild(wrapper);

    const btnPrev = document.getElementById('previous-button') as HTMLButtonElement;
    const btnNext = document.getElementById('next-button') as HTMLButtonElement;

    previousPage(btnPrev, onPageChange);
    nextPage(btnNext, onPageChange);
}

export function showPokemonPaginationButtons(id: string, onNavigate: (targetId: string) => Promise<void>) {

    const divContainer = document.getElementById('div-pokemon')
    if (!divContainer) return;

    const wrapper = document.createElement('div');
    wrapper.className = "pagination-wrapper";

    const buttonPreviousPokemon = document.createElement('button');
    buttonPreviousPokemon.textContent = "Previous Pokemon";

    const buttonNextPokemon = document.createElement('button');
    buttonNextPokemon.textContent = "Next Pokemon";

    wrapper.appendChild(buttonPreviousPokemon);
    wrapper.appendChild(buttonNextPokemon);

    divContainer.appendChild(wrapper);

    previousPokemon(buttonPreviousPokemon, id, async () => {
        const idOfPokemon = buttonPreviousPokemon.getAttribute("data-id-pokemon");
        if (!idOfPokemon) return;

        await onNavigate(idOfPokemon);
    });

    nextPokemon(buttonNextPokemon, id, async () => {
        const idOfPokemon = buttonNextPokemon.getAttribute("data-id-pokemon");
        if (!idOfPokemon) return;

        await onNavigate(idOfPokemon);
    });
}