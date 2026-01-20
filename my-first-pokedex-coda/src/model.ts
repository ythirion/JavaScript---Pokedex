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

export function imgPokemon(pokemon: Pokemon | null) {
    let srcImg = null;
    if (pokemon) {
        if (pokemon.sprites.front_default) {
            srcImg = pokemon.sprites.front_default;
        } else if (pokemon.sprites.other.showdown.front_default) {
            srcImg = pokemon.sprites.other.showdown.front_default;
        } else if (pokemon.sprites.other.home.front_default) {
            srcImg = pokemon.sprites.other.home.front_default;
        } else {
            srcImg = "src/img/favicon.png";
        }
    }

    return srcImg;
}