export function showTeam() {

    const teamButton = document.getElementById('teamBtn');

    teamButton?.addEventListener('click', async () => {
        const page = document.getElementById('div-pokemon');

        if (page) {
            page.innerHTML = "";

            for (let i = 1; i < 7; i++) {
                page.innerHTML += `
                    <div class="team">
                        <p>Pokemon ${i}</p>
                        <div id="team-number-${i}">
                            <button type="button" data-pokemon-id="${i}">Choose my pokemon</button>
                        </div>
                    </div>`
            }

            await openSearchTochoosePokemonForTeam(document.querySelectorAll("[data-pokemon-id]"));
        }
    })
}

async function openSearchTochoosePokemonForTeam(pokemonId: NodeListOf<Element>) {

    for (const element of pokemonId) {
        element.addEventListener('click', async () => {
            const appContainer = document.getElementById('div-pokemon');
            if (appContainer) {
                appContainer.innerHTML = '';

                appContainer.innerHTML += `
                <input type="search" id="searchForTeam" placeholder="Search...">
                <p id="error-message-for-team"></p>
                <input type="button" value="Search" id="searchBtnForTeam">`
            }
        })
    }

    await searchPokemonForTeam();
}

async function searchPokemonForTeam() {
    const search = document.getElementById('searchForTeam') as HTMLInputElement ;
    const searchValue = search.value;

    if (searchValue.length < 3 ) {
        const errorMessage = document.getElementById('error-message-for-team');
        if (errorMessage)
            errorMessage.innerHTML = "Please enter at least 3 characters.";
    } else {
        await getPokemonCorrespondingToSearchForTeam(searchValue);
    }
}

async function getPokemonCorrespondingToSearchForTeam(searchValue: string) {

}