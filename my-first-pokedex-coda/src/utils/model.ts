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
    species: {
        url: string;
    };
    cries: {
        latest: string;
        legacy: string;
    };
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
    stats: PokemonStat[];
    types: PokemonType[];
    abilities: PokemonAbilitie[];
}

interface PokemonStat {
    base_stat: number;
    stat: {
        name: string;
    };
}

export interface PokemonType {
    type: {
        name: string;
        url: string;
    };
}

interface PokemonAbilitie {
    ability: {
        name: string;
        url: string;
    };
}

export interface EvolutionChain {
    evolution_chain?: {
        url?: string;
    };
}

export interface Evolutions {
    chain?: Evolution;
}

export interface Evolution {
    species?: {
        name?: string;
        url?: string;
    };
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
    pokemon: PokemonOfType[];
}

interface PokemonOfType {
    pokemon: {
        name: string;
        url: string;
    };
}

export interface TeamOfPokemon {
    pokemon_1?: Pokemon;
    pokemon_2?: Pokemon;
    pokemon_3?: Pokemon;
    pokemon_4?: Pokemon;
    pokemon_5?: Pokemon;
    pokemon_6?: Pokemon;
}

export interface PokemonWeakness {
    damage_relations: {
        double_damage_from: Result[];
        double_damage_to: Result[];
        half_damage_from: Result[];
        half_damage_to: Result[];
        no_damage_from: Result[];
        no_damage_to: Result[];
    }
}
