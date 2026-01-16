export let offset = 0;
const limit = 20;
const totalPokemon = 1350;

export function previousPage(element, callback:() => void) {


    const setPrevious = () => {
        offset -= limit;
        if (offset < 0) {
            offset = totalPokemon - (totalPokemon % limit);
        }
        callback();
    };
    element.addEventListener("click", () => setPrevious());
}

export function nextPage(element, callback:() => void) {

    const setNext = () => {
        offset += limit;
        if (offset >= totalPokemon - limit) {
            offset = 0;
        }
        callback();
    }
    element.addEventListener("click", () => setNext());
}
