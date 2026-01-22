import './style.css'
import {showOnePokemon, getEvolution, getIdOfPokemonFromName} from './api.ts'
import {type Evolution, type ElementOfEvolution, imgPokemonFromInterface, imgPokemonFromId} from "./model.ts";
import {previousPokemon, nextPokemon} from "./pagination.ts";

export async function renderPokemon(id: string) {
    const pokemonInformations = await showOnePokemon(id);

    const namePokemon = pokemonInformations?.name;
    const nameUpperCase = namePokemon?.charAt(0).toUpperCase() + namePokemon!.slice(1).toLowerCase();

    const stat = pokemonInformations?.stats.map((pokemon)=>
        `<p> ${pokemon.stat.name}: ${pokemon.base_stat} </p>`).join(" ");

    const items = `
        <div>
            <img src=${imgPokemonFromInterface(pokemonInformations!)} alt="Image de ${pokemonInformations?.name}" height="200" onerror="this.src='src/img/favicon.png'; this.onerror=null;">
            <p>${nameUpperCase}</p>
            <p>Id : #${pokemonInformations?.id}</p>
            <p>${stat}</p>
            <p>Crie : 
                <audio controls src="${pokemonInformations?.cries.latest}"></audio>
                <a href="${pokemonInformations?.cries.latest}">Download file</a>
            </p>
            <p id="pokemon-evolutions"></p>
        </div>
    `;

    const pokemonId = document.getElementById('div-pokemon');
    pokemonId!.innerHTML = items;


    const pokemonEvolutions = await getEvolution (pokemonInformations?.name!);

    if (pokemonEvolutions?.chain?.evolves_to && pokemonEvolutions.chain.species?.name) {
        const firstPokemon : ElementOfEvolution = {namePokemon: pokemonEvolutions.chain.species?.name, namePreviousPokemon: ""};
        const tableOfEvolution = evolutionData(pokemonEvolutions.chain.evolves_to, firstPokemon.namePokemon);
        tableOfEvolution.unshift(firstPokemon);

        const evolutionContainer = document.getElementById('pokemon-evolutions');

        const pokemonId = await getIdOfPokemonFromName(firstPokemon.namePokemon);
        const imgUrl = imgPokemonFromId(pokemonId!);

        let text = `Evolution: <span class='pokemon-of-evolution-chain' id="${firstPokemon.namePokemon}"><img src="${imgUrl}" alt="Image of ${firstPokemon.namePokemon}" height="70">${firstPokemon.namePokemon}</span>`;
        let previousName = "";
        for (let i = 1; i < tableOfEvolution.length; i++) {

            const pokemonId = await getIdOfPokemonFromName(tableOfEvolution[i].namePokemon);
            const imgUrl = imgPokemonFromId(pokemonId!);

            if (tableOfEvolution[i].namePreviousPokemon == previousName) {
                text += ", " + `<span class="pokemon-of-evolution-chain" id="${tableOfEvolution[i].namePokemon}">` + `<img src="${imgUrl}" alt="Image of ${tableOfEvolution[i].namePokemon}" height="70">` + tableOfEvolution[i].namePokemon + "</span>";
            }
            else {
                text += " → " + `<span class="pokemon-of-evolution-chain" id="${tableOfEvolution[i].namePokemon}">` + `<img src="${imgUrl}" alt="Image of ${tableOfEvolution[i].namePokemon}" height="70">` + tableOfEvolution[i].namePokemon + "</span>";
                previousName = tableOfEvolution[i].namePreviousPokemon;
            }
        }

        if (evolutionContainer) {
            evolutionContainer.innerHTML = text;
        }
    }

    showPokemonPaginationButtons(id);

    const linkToPokemonOfEvolutionChain = document.getElementsByClassName('pokemon-of-evolution-chain');
    for (let element of linkToPokemonOfEvolutionChain) {
        if (element.getAttribute('id')) {
            const idPokemon = await getIdOfPokemonFromName(element.getAttribute('id')!);
            const idPokemonToString = idPokemon?.toString();
            element.addEventListener("click", (event) => {
                event.stopPropagation();
                renderPokemon(idPokemonToString!);
            });
        }
    }
}



export function evolutionData(pokemonEvolutions: Evolution[], previousPokemon : string) : ElementOfEvolution[] {

    let table : ElementOfEvolution[] = []
    for (const pokemon of pokemonEvolutions) {
        if (pokemon.species?.name) {
            table.push({namePokemon : pokemon.species.name, namePreviousPokemon : previousPokemon});
        }

        if (pokemon.evolves_to && pokemon.species?.name) {
            const evo = evolutionData(pokemon.evolves_to, pokemon.species.name);
            table = [...table, ...evo];
        }
    }

    return table;
}

export function showPokemonPaginationButtons (id : string) {

    const buttonPreviousPokemon = document.createElement('button');
    buttonPreviousPokemon.innerHTML = `
<button id="previous-pokemon">Previous Pokemon</button>
`;
    document.getElementById('div-pokemon')?.appendChild(buttonPreviousPokemon);

    previousPokemon(buttonPreviousPokemon, id, () => renderPokemon(buttonPreviousPokemon.getAttribute("data-id-pokemon")!));


    const buttonNextPokemon = document.createElement('button');
    buttonNextPokemon.innerHTML = `
<button id="next-button">Next Pokemon</button>
`;
    document.getElementById('div-pokemon')?.appendChild(buttonNextPokemon);

    nextPokemon(buttonNextPokemon, id, () => renderPokemon(buttonNextPokemon.getAttribute("data-id-pokemon")!));

}