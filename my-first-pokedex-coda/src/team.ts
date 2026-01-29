import {getOnePokemonFromAPI} from "./api.ts";
import {imgPokemonFromInterface} from "./get-img.ts";
import {comparePokemonFromAll} from "./search.ts";
import type {TeamOfPokemon, Pokemon} from "./model.ts"

const teamOfPokemon : TeamOfPokemon = {};

export function showTeam() {

    const teamButton = document.getElementById('teamBtn');

    teamButton?.addEventListener('click', async () => {
        const page = document.getElementById('div-pokemon');

        if (page) {
            page.innerHTML = "";

            for (let i = 1; i < 7; i++) {
                const numberOfPokemon = "pokemon_" + i;
                if (teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]) {
                    const type = teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.types.map(pokemonType =>
                        `<img src="src/img/${pokemonType.type.name}.png" alt="${pokemonType.type.name}">`).join(" ");

                    page.innerHTML += `
                        <div class="pokemon-card" id="${teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.id}">
                            <p>${teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.name}</p>
                            <img src="${imgPokemonFromInterface(teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]!)}" 
                                alt="img of pokemon" height="100">
                            <p>${type}</p>
                        </div>`
                } else {
                    page.innerHTML += `
                    <div class="team">
                        <p>Pokemon ${i}</p>
                        <div id="team-number-${i}">
                            <button type="button" data-pokemon-id="pokemon_${i}">Choose my pokemon</button>
                        </div>
                    </div>`
                }

            }

            const btnToChoose = document.querySelectorAll("[data-pokemon-id]");
            await openSearchToChoosePokemonForTeam(btnToChoose);
        }
    })
}

async function openSearchToChoosePokemonForTeam(btnToChoose: NodeListOf<Element>) {

    for (const elementId of btnToChoose) {
        elementId.addEventListener('click', async () => {
            const appContainer = document.getElementById('div-pokemon');
            if (appContainer) {
                appContainer.innerHTML = '';

                appContainer.innerHTML += `
                <input type="search" id="searchForTeam" placeholder="Search pokemon by name...">
                <p id="errorMessageForTeam"></p>
                <input type="button" value="Search" id="searchBtnForTeam">`
            }
            if (elementId) {
                await searchPokemonForTeam(elementId);
            }
        })
    }
}

async function searchPokemonForTeam(elementId: Element) {

    const btnSearch = document.getElementById('searchBtnForTeam');

    btnSearch?.addEventListener('click', async () => {
        const search = document.getElementById('searchForTeam') as HTMLInputElement ;
        const searchValue = search.value;

        if (searchValue.length < 3 ) {
            const errorMessage = document.getElementById('errorMessageForTeam');
            if (errorMessage)
                errorMessage.innerHTML = "Please enter at least 3 characters.";
        } else {
            await getPokemonCorrespondingToSearchForTeam(searchValue, elementId);
        }
    })
}

async function getPokemonCorrespondingToSearchForTeam(searchValue: string, elementId: Element) {
    const arrayOfPokemon = await comparePokemonFromAll(searchValue);

    const pokemonContainer = document.getElementById('div-pokemon');
    const propositionOfPokemon = document.createElement('div');
    propositionOfPokemon.id = "propositionOfPokemon";
    if (pokemonContainer) {
        pokemonContainer.appendChild(propositionOfPokemon);
    }

    if (arrayOfPokemon) {

        propositionOfPokemon.innerHTML = "";

        if (arrayOfPokemon.length === 0) {
            propositionOfPokemon.innerHTML += `<p>Oops! You haven't caught this pokemon yet.</p>`;
        }

        const pokemonMap: Record<string, Pokemon> = {};

        for (let name of arrayOfPokemon) {
            const pokemonInformations = await getOnePokemonFromAPI(name);
            if (!pokemonInformations) {
                continue;
            }
            const pokemonId = pokemonInformations.id;

            const type = pokemonInformations?.types.map(pokemonType =>
                `<img src="src/img/${pokemonType.type.name}.png" alt="${pokemonType.type.name}">`).join(" ");

            propositionOfPokemon.innerHTML += `
                <div class="pokemon-card"  id="${pokemonId}">
                <p>${pokemonInformations.name}</p>
                <img src="${imgPokemonFromInterface(pokemonInformations)}" alt="img of pokemon" height="100">
                <p>${type}</p>
                </div>`

            pokemonMap[pokemonId] = pokemonInformations;
        }

        const pokemonCard = document.querySelectorAll('.pokemon-card');
        for (const element of pokemonCard) {

            element.addEventListener('click', () => {
                const valueOfElement = elementId.getAttribute('data-pokemon-id');
                const pokemonId = element.getAttribute('id');
                if (valueOfElement && pokemonMap[pokemonId!]) {
                    teamOfPokemon[valueOfElement as keyof TeamOfPokemon] = pokemonMap[pokemonId!];
                }

                const btnTeam = document.getElementById('teamBtn');
                btnTeam?.click();
            })
        }
    }
}