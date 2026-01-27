import {showTypeCheckbox, buttonSearchType} from "./advancedSearchType.ts";
import {showGenerationCheckbox, buttonSearchGeneration} from "./advancedSearchGeneration.ts";
import {buttonSearchId} from "./advancedSearchId.ts";

// show advanced search page (by id / by type / by abilities / by generation
export async function showAdvancedSearch() {

    let checkboxTypes = await showTypeCheckbox();
    let checkboxGeneration = await showGenerationCheckbox();

    const advancedSearchButton = document.getElementById('advancedSearch');

    advancedSearchButton?.addEventListener('click', () => {
        const page = document.getElementById('div-pokemon');

        if (page) {
            page.innerHTML = "";

            page.innerHTML += `
            <h2>Advanced Search</h2>
            <h3>Id Pokemon</h3>
            <label for="id">Id</label>
            <input type="number" name="id" id="id">
            <input type="button" value="Search" id="btnSearchId">
            <p id="message-error-id"></p>
            <h3>Types</h3>
            ${checkboxTypes}
            <input type="button" value="Search" id="btnSearchTypes">
            <p id="no-check-box-type"></p>
            <!--à voir plus tard quand on aura la foi
            <h3>Abilities</h3>
            <input type="button" value="Search" id="btnSearchAbilities"> -->
            <h3>Generations</h3>
            ${checkboxGeneration}
            <input type="button" value="Search" id="btnSearchGen">
            <p id="no-check-box-gen"></p>
            `
        }
        buttonSearchId ();
        buttonSearchType();
        buttonSearchGeneration();

    })
}