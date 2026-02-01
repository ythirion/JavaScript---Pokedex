import {getAbilities, getOnePokemonFromAPI, getPokemonIdFromAbility} from "../utils/api.ts";
import {imgPokemonFromInterface} from "../utils/get-img.ts";


export async function searchAbility() {
    const searchAbilitiesButton = document.getElementById('btnSearchAbilities');
    if (!searchAbilitiesButton) return;

    searchAbilitiesButton.addEventListener('click', async () => {
        const searchInput = document.getElementById('search-ability') as HTMLInputElement;
        const searchValue = searchInput.value;

        if (searchValue.length < 3) {
            const errorMessage = document.getElementById('list-of-abilities');
            if (!errorMessage) return;

            errorMessage.innerHTML = "Please enter at least 3 characters.";
        } else {
            await getAbilitiesCorrespondingToSearch(searchValue);
        }
    })
}

async function getAbilitiesCorrespondingToSearch(searchValue: string) {
    const arrayOfAbilities = await compareAbilityFromAll(searchValue);
    if (!arrayOfAbilities) return;

    const abilitiesContainer = document.getElementById('list-of-abilities');
    if (!abilitiesContainer) return;

    abilitiesContainer.innerHTML = "";

    if (arrayOfAbilities.length == 0) {
        abilitiesContainer.innerHTML += `<p>Oops! This ability doesn't exist.</p>`;
    }

    for (let ability of arrayOfAbilities) {
        const btn = document.createElement('button');
        btn.type = "button";
        btn.textContent = ability;
        btn.id = ability;
        btn.setAttribute('data-search-ability', `btn-ability-${ability}`);

        btn.addEventListener('click', async () => {
            await getPokemonOfAbilities(ability);
            btn.textContent = ability;
        });

        abilitiesContainer.appendChild(btn);
    }
}

async function compareAbilityFromAll(searchValue: string) {
    const arrayOfAbilities = await getAbilities();
    if (!arrayOfAbilities) return;

    const resultat = arrayOfAbilities.filter(name => name.toLowerCase().includes(searchValue.toLowerCase()));
    return resultat;
}

async function getPokemonOfAbilities(abilityName: string) {
    const pageContainer = document.getElementById('div-pokemon');
    if (!pageContainer) return;

    pageContainer.innerHTML = `<pokeball-loader></pokeball-loader>`;

    const pokemonsId = await getPokemonIdFromAbility(abilityName);
    if (!pokemonsId) return;

    if (pokemonsId.length === 0) {
        pageContainer.innerHTML = `<p>Oops! You didn't catch this pokemon yet.</p>`;
        return;
    }

    let allPokemonHTML = "";

    for (const id of pokemonsId) {
        const pokemon = await getOnePokemonFromAPI(id);
        if (!pokemon) return;

        const types = pokemon.types.map(type =>
            `<img src="src/img/${type.type.name}.png" alt="${type.type.name}">`).join("");

        allPokemonHTML += `
            <pokemon-card 
                id="${pokemon.id}" 
                name="${pokemon.name}" 
                img="${imgPokemonFromInterface(pokemon)}">
                ${types}
            </pokemon-card>`;
    }

    pageContainer.innerHTML = allPokemonHTML;
}