import type {Pokemon} from "./model.ts";

export function imgPokemonFromInterface(pokemon: Pokemon | null) {
    let srcImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
    return srcImg;
}

export function imgPokemonFromId(id : number) {
    let srcImg = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return srcImg;
}