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
            url?: string;
        }
        evolves_to?: Evolution[];
}

export interface ElementOfEvolution {
    namePokemon: string;
    namePreviousPokemon: string;
}

export interface Generations {
    pokemon_species: Result[];
}

export interface Type {
    pokemon : PokemonOfType[];
}

interface PokemonOfType {
    pokemon : {
        name : string;
        url : string;
    }
}
