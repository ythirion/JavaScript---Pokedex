import {getOnePokemonFromAPI} from "../utils/api.ts";
import {imgPokemonFromInterface} from "../utils/get-img.ts";
import {comparePokemonFromAll} from "../search/search.ts";
import type {TeamOfPokemon, Pokemon} from "../utils/model.ts";
import "../web-component/pokemon-team.ts";
import {getEveryRelationDamageForTeam} from "./weakness-team.ts";

if (!localStorage.getItem("iStorage")) {
    localStorage.setItem("iStorage", "1");
}

let teamOfPokemon : TeamOfPokemon = {};
let isEditingLocalStorage = false;
let currentEditingTeamName = "";

export function showTeam() {

    const teamButton = document.getElementById('teamBtn');
    if (!teamButton) return;

    teamButton.addEventListener('click', async () => {

        isEditingLocalStorage = false;

        const page = document.getElementById('div-pokemon');
        if (!page) return;

        page.innerHTML = "";

        showSixSpaceForPokemon(page);
        showSpaceForTeamIntoLocalStorage(page);

        const btnToChoose = document.querySelectorAll("[data-pokemon-id]");
        await openSearchToChoosePokemonForTeam(btnToChoose);

        saveTeamIntoLocalStorage();
        showTeamIntoLocalStorage();
        await changeTeamOfLocalStorage();
    })
}

function showSixSpaceForPokemon(page: HTMLElement) {
    for (let i = 1; i < 7; i++) {
        const numberOfPokemon = "pokemon_" + i;

        if (teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]) {
            const type = teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.types.map(pokemonType =>
                `<img src="src/img/${pokemonType.type.name}.png" alt="${pokemonType.type.name}">`).join(" ");

            page.innerHTML += `<pokemon-team id="${teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.id}"
                name="${teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.name}"
                img="${imgPokemonFromInterface(teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]!)}">
                    ${type}
                </pokemon-team>
                <button type="button" data-pokemon-id="${numberOfPokemon}">Change Pokemon</button>`
        } else {
            page.innerHTML += `
                <div class="team">
                    <p>Pokemon ${i}</p>
                    <div id="team-number-${i}">
                        <button type="button" data-pokemon-id="${numberOfPokemon}">Choose my pokemon</button>
                    </div>
                </div>`
        }
    }
}

function showSpaceForTeamIntoLocalStorage(page: HTMLElement) {
    let teamName = ``;

    for (let i = 1; i < 11; i++) {
        teamName += `<h4 id="team-${i}">Team ${i}</h4>
            <button type="button" id="change-team-${i}" data-change="team-${i}">Show team</button>`;
    }

    page.innerHTML += `<button type="button" id="save-local-storage">Sauvegarder mon équipe dans le localStorage</button>
        <p id="error-message-storage"></p>
        <h3>Mes équipes enregistrées</h3>
        <div id="team-local-storage">
        ${teamName}
        </div>`;
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

    const propositionOfPokemonContainer = document.createElement('div');
    if (!propositionOfPokemonContainer) return;
    propositionOfPokemonContainer.id = "propositionOfPokemon";

    pokemonContainer.appendChild(propositionOfPokemonContainer);

    propositionOfPokemonContainer.innerHTML = "";

    const pokemonMap = await showPokemonCorrespondingToSearchForTeam(arrayOfPokemon, propositionOfPokemonContainer);
    if (!pokemonMap) return;

    const pokemonCard = document.querySelectorAll('pokemon-team');

    addEventListenerToPokemonCorrespondingToSearch(pokemonCard, elementId, pokemonMap);

}

async function showPokemonCorrespondingToSearchForTeam(arrayOfPokemon: string[], HTMLContainer: HTMLElement ): Promise<Record<string, Pokemon>> {
    if (arrayOfPokemon.length === 0) {
        HTMLContainer.innerHTML += `<p>Oops! You haven't caught this pokemon yet.</p>`;
    }

    const pokemonMap: Record<string, Pokemon> = {};

    for (let name of arrayOfPokemon) {
        const pokemonInformations = await getOnePokemonFromAPI(name);
        if (!pokemonInformations) continue;

        const pokemonId = pokemonInformations.id;

        const type = pokemonInformations.types.map(pokemonType =>
            `<img src="src/img/${pokemonType.type.name}.png" alt="${pokemonType.type.name}">`).join(" ");

        HTMLContainer.innerHTML += `<pokemon-team id="${pokemonId}" 
                                                  name="${pokemonInformations.name}" 
                                                  img="${imgPokemonFromInterface(pokemonInformations)}">
                                      ${type}
                                    </pokemon-team>`

        pokemonMap[pokemonId] = pokemonInformations;
    }

    return pokemonMap;
}

function addEventListenerToPokemonCorrespondingToSearch(pokemonCard: NodeListOf<Element>, elementId: Element, pokemonMap: Record<string, Pokemon>) {
    for (const element of pokemonCard) {

        element.addEventListener('click', async () => {
            const valueOfElement = elementId.getAttribute('data-pokemon-id');
            if (!valueOfElement) return;
            const pokemonId = element.getAttribute('id');
            if (!pokemonId) return;

            teamOfPokemon[valueOfElement as keyof TeamOfPokemon] = pokemonMap[pokemonId];

            if (isEditingLocalStorage) {
                const pokemonContainer = document.getElementById('div-pokemon');
                if (!pokemonContainer) return;

                await refreshEditionInterface(pokemonContainer, currentEditingTeamName);

            } else {
                const btnTeam = document.getElementById('teamBtn');
                if (!btnTeam) return;

                btnTeam.click();
            }
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

                teamContainer.innerHTML +=
                    `<pokemon-team id="${pokemon.id}" 
                                   name="${pokemon.name}" 
                                   img="${imgPokemonFromInterface(pokemon)}">
                        ${type}
                    </pokemon-team>`
            })
        } else {
            const btnShowTeam = document.getElementById(`change-team-${i}`);
            if (!btnShowTeam) return;

            btnShowTeam.setAttribute('hidden', 'hidden');
        }
    }
}

async function changeTeamOfLocalStorage() {
    const btnShowTeam = document.querySelectorAll('[data-change]');
    if (!btnShowTeam) return;

    const pokemonContainer = document.getElementById('div-pokemon');
    if (!pokemonContainer) return;

    showPokemonOfLocalStorageTeam(btnShowTeam, pokemonContainer);
}

function showPokemonOfLocalStorageTeam(btnChangeTeam: NodeListOf<Element>, pokemonContainer: HTMLElement) {
    for (const element of btnChangeTeam) {
        element.addEventListener('click', async () => {

            isEditingLocalStorage = true;

            pokemonContainer.innerHTML = "";

            const nameOfTeam = element.getAttribute('data-change');
            if (!nameOfTeam) return;

            currentEditingTeamName = nameOfTeam;

            if (!localStorage.getItem(nameOfTeam)) return;
            const storedData = localStorage.getItem(nameOfTeam);
            if (!storedData) return;

            teamOfPokemon = JSON.parse(storedData);

            await refreshEditionInterface(pokemonContainer, nameOfTeam)




            // Faire tests ici !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





        });
    }
}

function renderTeamInterface(pokemonContainer: HTMLElement, nameOfTeam: string) {
    for (let i = 1; i < 7; i++) {
        let numberOfPokemon = `pokemon_${i}`;
        if (teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]) {
            const type = teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.types.map(pokemonType =>
                `<img src="src/img/${pokemonType.type.name}.png" alt="${pokemonType.type.name}">`).join(" ");

            pokemonContainer.innerHTML +=
                `<pokemon-team id="${teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]!.id}"
                    name="${teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]?.name}"
                    img="${imgPokemonFromInterface(teamOfPokemon[numberOfPokemon as keyof TeamOfPokemon]!)}">
                        ${type}
                </pokemon-team>
                <button type="button" data-pokemon-id="${numberOfPokemon}">Change Pokemon</button>`;
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

    pokemonContainer.innerHTML += `<button type="button" data-save-id="${nameOfTeam}">Save the team into Local Storage</button>`;
}

function saveExistingTeamIntoLocalStorage(btnSaveChanges: Element) {
    btnSaveChanges.addEventListener('click', async () => {
        const nameOfTeam = btnSaveChanges.getAttribute('data-save-id');
        if (!nameOfTeam) return;

        localStorage.setItem(nameOfTeam, JSON.stringify(teamOfPokemon));

        alert("Team successfully saved to Local Storage!");
    })
}

async function refreshEditionInterface(container: HTMLElement, teamName: string) {
    container.innerHTML = "";
    renderTeamInterface(container, teamName);

    await getEveryRelationDamageForTeam(teamOfPokemon);

    const btnToChoose = container.querySelectorAll("[data-pokemon-id]");
    await openSearchToChoosePokemonForTeam(btnToChoose);

    const btnSaveChanges = container.querySelector("[data-save-id]");
    if (btnSaveChanges) saveExistingTeamIntoLocalStorage(btnSaveChanges);
}