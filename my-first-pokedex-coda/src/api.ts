import type {Generations, ResultAPI, Pokemon, EvolutionChain, Evolutions, Type} from "./model.ts";
import {getIdFromUrl} from "./regex.ts";

export async function getOnePokemonFromAPI(id: string): Promise<Pokemon | null>  {
    const urlAPI = `https://pokeapi.co/api/v2/pokemon/${id}/`;

    try {
        const responseOnePokemon = await fetch(urlAPI);

        if (!responseOnePokemon.ok) {
            throw new Error(responseOnePokemon.statusText);
        }
        const onePokemon = await responseOnePokemon.json() as Pokemon;

        return onePokemon;
    } catch (error) {
        console.error(error);
        return null;
    }
}

// get all pokemons from API with pagination
export async function getPokemonsFromAPI (limit: number = 20,
                                   offset: number = 0 )
    : Promise<Pokemon[] | null> {

    const urlAPI = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    try {
        const response = await fetch(urlAPI);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() as ResultAPI;


        const tableOfPokemonsName = [];

        for (let pokemon of data.results) {
            tableOfPokemonsName.push(pokemon.name);
        }

        let tableOfPokemons = await Promise.all(tableOfPokemonsName.map(async pokemon => {
            const responseOnePokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
            return await responseOnePokemon.json() as Pokemon;
        }));

        return tableOfPokemons;

    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getEvolutionChain (id: string) : Promise<EvolutionChain | null> {
    const data = await getOnePokemonFromAPI(id);
    if (!data) {
        return null;
    }

    const urlAPIEvolutionChain = data.species.url;


    try {
        const responseOnePokemon = await fetch(urlAPIEvolutionChain);

        if (!responseOnePokemon.ok) {
            throw new Error(responseOnePokemon.statusText);
        }
        const EvolutionChainPokemon = await responseOnePokemon.json() as EvolutionChain;

        return EvolutionChainPokemon;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getEvolution (id: string) : Promise<Evolutions | null> {
    const data = await getEvolutionChain (id);

    if (!data) {
        return null;
    }

    const urlAPIEvolution = data.evolution_chain?.url


    try {
        const responseOnePokemon = await fetch(urlAPIEvolution!);

        if (!responseOnePokemon.ok) {
            throw new Error(responseOnePokemon.statusText);
        }
        const evolutionPokemon = await responseOnePokemon.json() as Evolutions;

        return evolutionPokemon;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getNameOfAllPokemons() : Promise<string[] | null> {

    const limit = 1350;
    const urlAPI = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=0`;

    try {
        const response = await fetch(urlAPI);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() as ResultAPI;

        const tableOfPokemons = [];

        for (let pokemon of data.results) {
           const nameOfPokemon = pokemon.name;
           tableOfPokemons.push(nameOfPokemon);
        }

        return tableOfPokemons;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function  getIdOfPokemonFromName(name: string) {
    const pokemonInformations = await getOnePokemonFromAPI(name);

    const idPokemon = pokemonInformations?.id;

    return idPokemon;
}

export async function getNameOfPokemonFromId(id: string) {
    const pokemonInformations = await getOnePokemonFromAPI(id);
    const namePokemon = pokemonInformations?.name;
    return namePokemon;
}

export async function getTypes() {
    const urlAPI = `https://pokeapi.co/api/v2/type`;

    try {
        const response = await fetch(urlAPI);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() as ResultAPI;

        const tableOfTypes = [];

        for (let type of data.results) {
            const nameOfType = type.name;
            tableOfTypes.push(nameOfType);
        }

        return tableOfTypes;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getGenerations() {
    const urlAPI = `https://pokeapi.co/api/v2/generation`;

    try {
        const response = await fetch(urlAPI);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() as ResultAPI;

        const tableOfGenerations = [];

        for (let generation of data.results) {
            const nameOfGeneration = generation.name;
            tableOfGenerations.push(nameOfGeneration);
        }

        return tableOfGenerations;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getPokemonIdFromGen(gen: string) : Promise<string[] | null> {
    const urlAPI = `https://pokeapi.co/api/v2/generation/${gen}/`;

    try {
        const response = await fetch(urlAPI);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json() as Generations;

        const tableOfPokemon = [];

        for (let pokemon of data.pokemon_species) {
            const urlOfPokemon = pokemon.url;
            const idOfPokemon = getIdFromUrl(urlOfPokemon);
            if (idOfPokemon) {
                tableOfPokemon.push(idOfPokemon);
            }
        }

        return tableOfPokemon;

    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getPokemonIdFromType(type: string) : Promise<string[] | null> {
    const urlAPI = `https://pokeapi.co/api/v2/type/${type}/`;

    try {
        const response = await fetch(urlAPI);
        if (!response.ok) {
            throw new Error(response.statusText)
        }
        const data = await response.json() as Type;

        const tableOfPokemon = [];

        for (let pokemon of data.pokemon) {
            const urlOfPokemon = pokemon.pokemon.url;
            const idOfPokemon = getIdFromUrl(urlOfPokemon);
            if (idOfPokemon) {
                tableOfPokemon.push(idOfPokemon);
            }
        }

        return tableOfPokemon;

    } catch (error) {
        console.error(error);
        return null;
    }
}