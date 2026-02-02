import {showTypeCheckbox, buttonSearchType} from "./advancedSearchType.ts";
import {showGenerationCheckbox, buttonSearchGeneration} from "./advancedSearchGeneration.ts";
import {buttonSearchId} from "./advancedSearchId.ts";
import {searchAbility} from "./advancedSearchAbility.ts";

// show advanced search page (by id / by type / by abilities / by generation
export async function showAdvancedSearch() {

    let checkboxTypes = await showTypeCheckbox();
    let checkboxGeneration = await showGenerationCheckbox();

    const advancedSearchButton = document.getElementById('advancedSearch');
    if (!advancedSearchButton) return;

    advancedSearchButton.addEventListener('click', async () => {
        const pageContainer = document.getElementById('div-pokemon');
        if (!pageContainer) return;

        pageContainer.style.display = "grid";
        pageContainer.innerHTML = `
            <div class="advanced-search-container">
                <aside class="search-sidebar">
                    <h2>Filters</h2>
                    
                    <section>
                        <h3>By ID</h3>
                        <input type="number" id="id" placeholder="Ex: 25">
                        <button id="btnSearchId" class="btn-neon">Search ID</button>
                        <p id="message-error-id" class="error"></p>
                    </section>

                    <section>
                        <h3>By Types</h3>
                        <div class="filter-group">${checkboxTypes}</div>
                        <button id="btnSearchTypes" class="btn-neon">Filter Types</button>
                    </section>

                    <section>
                        <h3>By Ability</h3>
                        <input type="search" id="search-ability" placeholder="Ability name...">
                        <div id="list-of-abilities"></div>
                        <button id="btnSearchAbilities" class="btn-neon">Search Ability</button>
                    </section>

                    <section>
                        <h3>By Generation</h3>
                        <div class="filter-group">${checkboxGeneration}</div>
                        <button id="btnSearchGen" class="btn-neon">Filter Generation</button>
                    </section>
                </aside>

                <main id="search-results" class="pokedex-grid">
                    <p class="placeholder-text">Select filters to start searching...</p>
                </main>
            </div>
        `;

        await buttonSearchId();
        await buttonSearchType();
        await searchAbility();
        await buttonSearchGeneration();
    })
}