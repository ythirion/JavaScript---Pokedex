import type {ResultAPI} from "./model.ts";
import type {Pokemon, EvolutionChain, Evolutions} from "./model.ts";

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


export async function showOnePokemon(id: string)  {
    const data = await getOnePokemonFromAPI(id);
    if (!data) {
        return null;
    }

    return data;
}

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

        const tableOfPokemons = [];

        for (let pokemon of data.results) {
            const responseOnePokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
            const onePokemon = await responseOnePokemon.json() as Pokemon;
            tableOfPokemons.push(onePokemon);
        }

        return tableOfPokemons;

    } catch (error) {
        console.error(error);
        return null;
    }
}


export async function showPokemons (limit: number = 20, offset: number ): Promise<Pokemon[] | null> {
    const data = await getPokemonsFromAPI(limit, offset);

    if (!data) {
        return null;
    }

    return data;

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