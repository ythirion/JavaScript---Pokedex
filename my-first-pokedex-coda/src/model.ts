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