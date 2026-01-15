import './style.css'

interface ResultAPI {
    results: Result[];
}

interface Result {
    name: string;
    url: string;
}

interface Pokemon {
    id: number;
    name: string;
    stats: PokemonStat[];
    cries: {
        latest: string;
        legacy: string;
    }
    sprites: {
        front_default: string;
    };
    types: PokemonType[];
    abilities: PokemonAbilitie[];
// generation:
}

interface PokemonStat {
    base_stat: number;
    stat: {
        name: string;
    }
}

interface PokemonAbilitie {
    is_hidden: boolean;
    slot: number;
    ability: {
        name: string;
        url: string;
    }
}


interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    }
}


async function getOnePokemonFromAPI(name: string): Promise<Pokemon | null>  {
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


async function showOnePokemon(name: string)  {
    const data = await getOnePokemonFromAPI(name);
    if (!data) {
        return null;
    }
    console.log(data.id, data.name, data.sprites.front_default, data.cries.latest, data.cries.legacy);

    for (const stat of data.stats) {
        console.log(`${stat.stat.name}:${stat.base_stat}`);
    }
}

showOnePokemon('pidgey');


async function getPokemonsFromAPI (limit: number = 20,
                                   offset: number = 0 )
    : Promise<Pokemon[] | null> {

    const urlAPI = `https://pokeapi.co/api/v2/pokemon?${limit}&${offset}`;

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


async function showPokemons (limit: number = 20, offset: number = 0 ) {
    const data = await getPokemonsFromAPI(limit, offset);

    if (!data) {
        return null;
    }

    for (let pokemon of data) {
        console.log(pokemon.name);
        console.log(pokemon.id);
        console.log(pokemon.sprites?.front_default);
    }

}

showPokemons();



