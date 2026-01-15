import type {ResultAPI} from "./model.ts";
import type {Pokemon} from "./model.ts";

export async function getOnePokemonFromAPI(name: string): Promise<Pokemon | null>  {
    const urlAPI = `https://pokeapi.co/api/v2/pokemon/${name}`;

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


export async function showOnePokemon(name: string)  {
    const data = await getOnePokemonFromAPI(name);
    if (!data) {
        return null;
    }
    console.log(data.id, data.name, data.sprites.front_default, data.cries.latest, data.cries.legacy);

    for (const stat of data.stats) {
        console.log(`${stat.stat.name}: ${stat.base_stat}`);
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

    for (let pokemon of data) {
        console.log(pokemon.name);
        console.log(pokemon.id);
        console.log(pokemon.sprites?.front_default);
    }

    return data;

}