import './style.css'

interface Pokemon {
    id: number,
    name: string,
    stats: PokemonStat[],
    cries: PokemonCrie[],
    pictures: PokemonPicture[],
    types: PokemonType[],
    abilities: PokemonAbilitie[],
    generation:

}

interface PokemonForList {
    name: string,
    pictures: PokemonPicture[],
}

interface PokemonStat {

}

interface PokemonAbilitie {

}

interface PokemonCrie {

}

interface PokemonType {

}

interface PokemonPicture {

}


async function getPokemonsFromAPI (limit: number = 20,
                                   offset: number = 0 )
    : Promise<PokemonForList[] | null> {
    const urlAPI = `https://pokeapi.co/api/v2/pokemon?${limit}=20&${offset}=0`;

    try {
        const response = await fetch(urlAPI);
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error(error);
    }
}
