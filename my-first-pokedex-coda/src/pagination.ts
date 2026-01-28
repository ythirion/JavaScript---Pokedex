export let offset = 0;
const limit = 20;
const totalPokemon = 1350;

export function previousPage(element: HTMLElement, callback:() => void) {
    const setPrevious = () => {
        offset -= limit;
        if (offset < 0) {
            offset = ((totalPokemon - 1) / limit) * limit;
        }
        callback();
    };
    element.addEventListener("click", () => setPrevious());
}

export function nextPage(element: HTMLElement, callback:() => void) {
    const setNext = () => {
        offset += limit;
        if (offset >= totalPokemon) {
            offset = 0;
        }
        callback();
    }
    element.addEventListener("click", () => setNext());
}


export function previousPokemon (element: HTMLElement, id: string, callback:() => void) {
    const setPrevious = () => {
        let idInt = parseInt(id);
        idInt -= 1 ;
        if (idInt == 1 - 1) {
            idInt = 10325;
        }

        if (idInt == 10001 - 1) {
            idInt = 1025;
        }
        const idString = idInt.toString();
        element.setAttribute("data-id-pokemon", idString);
        callback();
    };
    element.addEventListener("click", () => setPrevious());
}

export function nextPokemon(element: HTMLElement, id: string, callback:() => void) {
    const setNext = () => {
        let idInt = parseInt(id);
        idInt += 1;
        if (idInt == 1025 + 1 ) {
            idInt = 10001;
        }

        if (idInt == 10325 + 1) {
            idInt = 1;
        }
        const idString = idInt.toString();
        element.setAttribute("data-id-pokemon", idString);
        callback();
    }
    element.addEventListener("click", () => setNext());
}
