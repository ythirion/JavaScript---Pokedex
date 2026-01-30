import {getOnePokemonFromAPI} from "../utils/api.ts";
import {imgPokemonFromInterface} from "../utils/get-img.ts";
import {comparePokemonFromAll} from "../search/search.ts";
import type {TeamOfPokemon, Pokemon} from "../utils/model.ts"
import "../web-component/pokemon-team.ts"

if (!localStorage.getItem("iStorage")) {
    localStorage.setItem("iStorage", "1");
}

const teamOfPokemon : TeamOfPokemon = {};

export function showTeam() {

    const teamButton = document.getElementById('teamBtn');
    if (!teamButton) return;

    teamButton.addEventListener('click', async () => {
        const page = document.getElementById('div-pokemon');
        if (!page) return;

        page.innerHTML = "";

        for (let i = 1; i < 7; i++) {
            const numberOfPokemon = "pokemon_" + i;

            if (teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]) {
                const type = teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.types.map(pokemonType =>
                    `<img src="src/img/${pokemonType.type.name}.png" alt="${pokemonType.type.name}">`).join(" ");

                page.innerHTML += `<pokemon-team id="${teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.id}"
                    name="${teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.name}"
                    img="${imgPokemonFromInterface(teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]!)}"
                    i="${i}">
                        ${type}
                    </pokemon-team>`
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

        let teamName = ``;

        for (let i = 1; i < 11; i++) {
            teamName += `<h4 id="team-${i}">Team ${i}</h4>
                <button type="button" id="change-team-${i}" data-change="team-${i}">Change team</button>`;
        }

        page.innerHTML += `<button type="button" id="save-local-storage">Sauvegarder mon équipe dans le localStorage</button>
          <p id="error-message-storage"></p>
          <h3>Mes équipes enregistrées</h3>
          <div id="team-local-storage">
          ${teamName}
          </div>`;

        const btnToChoose = document.querySelectorAll("[data-pokemon-id]");
        await openSearchToChoosePokemonForTeam(btnToChoose);
        saveTeamIntoLocalStorage();
        showTeamIntoLocalStorage();
        changeTeamOfLocalStorage();
    })
}

async function openSearchToChoosePokemonForTeam(btnToChoose: NodeListOf<Element>) {
    for (const elementId of btnToChoose) {
        elementId.addEventListener('click', async () => {
            const appContainer = document.getElementById('div-pokemon');
            if (!appContainer) return;

            appContainer.innerHTML = '';

            appContainer.innerHTML += `
                <input type="search" id="searchForTeam" placeholder="Search pokemon by name...">
                <p id="errorMessageForTeam"></p>
                <input type="button" value="Search" id="searchBtnForTeam">`

            await searchPokemonForTeam(elementId);
        })
    }
}

async function searchPokemonForTeam(elementId: Element) {
    const btnSearch = document.getElementById('searchBtnForTeam');
    if (!btnSearch) return;

    btnSearch.addEventListener('click', async () => {
        const search = document.getElementById('searchForTeam') as HTMLInputElement;
        const searchValue = search.value;

        if (searchValue.length < 3) {
            const errorMessage = document.getElementById('errorMessageForTeam');
            if (!errorMessage) return;

            errorMessage.innerHTML = "Please enter at least 3 characters.";
        } else {
            await getPokemonCorrespondingToSearchForTeam(searchValue, elementId);
        }
    })
}

async function getPokemonCorrespondingToSearchForTeam(searchValue: string, elementId: Element) {
    const arrayOfPokemon = await comparePokemonFromAll(searchValue);
    if (!arrayOfPokemon) return;

    const pokemonContainer = document.getElementById('div-pokemon');
    if (!pokemonContainer) return;

    const propositionOfPokemon = document.createElement('div');
    if (!propositionOfPokemon) return;
    propositionOfPokemon.id = "propositionOfPokemon";

    pokemonContainer.appendChild(propositionOfPokemon);

    propositionOfPokemon.innerHTML = "";

    if (arrayOfPokemon.length === 0) {
        propositionOfPokemon.innerHTML += `<p>Oops! You haven't caught this pokemon yet.</p>`;
    }

    const pokemonMap: Record<string, Pokemon> = {};

    for (let name of arrayOfPokemon) {
        const pokemonInformations = await getOnePokemonFromAPI(name);
        if (!pokemonInformations) continue;

        const pokemonId = pokemonInformations.id;

        const type = pokemonInformations.types.map(pokemonType =>
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
            if (!valueOfElement) return;
            const pokemonId = element.getAttribute('id');
            if (!pokemonId) return;

            teamOfPokemon[valueOfElement as keyof TeamOfPokemon] = pokemonMap[pokemonId];

            const btnTeam = document.getElementById('teamBtn');
            if (!btnTeam) return;

            btnTeam.click();
        })
    }
}

function saveTeamIntoLocalStorage() {
    const btnSave = document.getElementById('save-local-storage');
    if (!btnSave) return;

    btnSave.addEventListener('click', async () => {
        const iStorage = localStorage.getItem("iStorage");
        if (!iStorage) return;

        let iStorageToNb = parseInt(iStorage);

        if (iStorageToNb === 11) {
            const errorMessage = document.getElementById('error-message-storage');
            if (!errorMessage) return;

            errorMessage.innerHTML = "You can't have more than 10 teams.";
        } else {
            localStorage.setItem(`team-${iStorage}`, JSON.stringify(teamOfPokemon));
            ++iStorageToNb;
            localStorage.setItem(`iStorage`, `${iStorageToNb}`);

            const btnTeam = document.getElementById('teamBtn');
            if (!btnTeam) return;

            btnTeam.click();
        }
    })
}

function showTeamIntoLocalStorage() {

    for (let i = 1; i < 11; i++) {
        if (localStorage.getItem(`team-${i}`)) {
            let teamContainer = document.getElementById(`team-${i}`);
            if (!teamContainer) return;

            let pokemons: TeamOfPokemon = JSON.parse(localStorage.getItem(`team-${i}`)!);
            if (!pokemons) return;

            Object.values(pokemons).forEach((pokemon: Pokemon) => {
                const type = pokemon.types.map(pokemonType =>
                    `<img src="src/img/${pokemonType.type.name}.png" alt="${pokemonType.type.name}">`).join(" ");

                teamContainer.innerHTML += `
                    <div class="pokemon-card">
                    <p>${pokemon.name}</p>
                    <img src="${imgPokemonFromInterface(pokemon)}" alt="img of pokemon" height="100">
                    <p>${type}</p>
                    </div>`
            })
        } else {
            const btnChangeTeam = document.getElementById(`change-team-${i}`);
            if (!btnChangeTeam) return;

            btnChangeTeam.setAttribute('hidden', 'hidden');
        }
    }
}

function changeTeamOfLocalStorage() {
    const btnChangeTeam = document.querySelectorAll('[data-change]');
    if (!btnChangeTeam) return;

    const pokemonContainer = document.getElementById('div-pokemon');
    if (!pokemonContainer) return;

    for (const element of btnChangeTeam) {
        element.addEventListener('click', async () => {

            pokemonContainer.innerHTML = "";

            const nameOfTeam = element.getAttribute('data-change');
            if (!nameOfTeam) return;

            if (!localStorage.getItem(nameOfTeam)) return;
            const teamOfPokemon: TeamOfPokemon = JSON.parse(localStorage.getItem(nameOfTeam)!);

            for (let i = 1; i < 7; i++) {
                let numberOfPokemon = `pokemon_${i}`;
                if (teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]) {
                    const type = teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.types.map(pokemonType =>
                        `<img src="src/img/${pokemonType.type.name}.png" alt="${pokemonType.type.name}">`).join(" ");

                    pokemonContainer.innerHTML += `<pokemon-team id="${teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.id}"
                                        name="${teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.name}"
                                        img="${imgPokemonFromInterface(teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]!)}"
                                        i="${i}">
                                            ${type}
                                        </pokemon-team>`
                } else {
                    pokemonContainer.innerHTML += `
                                    <div class="team">
                                        <p>Pokemon ${i}</p>
                                        <div id="team-number-${i}">
                                         <button type="button" data-pokemon-id="pokemon_${i}">Choose my pokemon</button>
                                        </div>
                                    </div>`
                }
            }

            const btnToChoose = document.querySelectorAll("[data-pokemon-id^=pokemon_]");
            console.log(btnToChoose);
            await openSearchToChoosePokemonForTeam(btnToChoose);

            const test = document.querySelector("pokemon-team");
            const result = test!.shadowRoot!.querySelector('button');
            console.log(result);
        });
    }
}