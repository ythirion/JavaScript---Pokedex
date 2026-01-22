export interface ResultAPI {
    results: Result[];
}

interface Result {
    name: string;
    url: string;
}

export interface Pokemon {
    id: number;
    name: string;
    stats: PokemonStat[];
    cries: {
        latest: string;
        legacy: string;
    }
    sprites: {
        front_default: string;
        other: {
            home: {
                front_default: string;
            }
            showdown: {
                front_default: string;
            }
        }
    };
    types: PokemonType[];
    abilities: PokemonAbilitie[];
    species: {
        url: string;
    }
}

interface PokemonStat {
    base_stat: number;
    stat: {
        name: string;
    }
}

interface PokemonAbilitie {
    ability: {
        name: string;
        url: string;
    }
}

interface PokemonType {
    type: {
        name: string;
        url: string;
    }
}

export interface EvolutionChain {
    evolution_chain?: {
        url?: string;
    }
}

export interface Evolutions {
    chain?: Evolution;
}

export interface Evolution {
        species?: {
            name?: string;
        }
        evolves_to?: Evolution[];
}

export interface ElementOfEvolution {
    namePokemon: string;
    namePreviousPokemon: string;
}


export function imgPokemonFromInterface(pokemon: Pokemon | null) {
    let srcImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
    return srcImg;
}

export function imgPokemonFromId(id : number) {
    let srcImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return srcImg;
}

