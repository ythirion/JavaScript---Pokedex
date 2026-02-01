import type {PokemonWeakness, TeamOfPokemon} from "../utils/model.ts";
import {getRelationDamageOfType, getTypes} from "../utils/api.ts";

export async function getEveryRelationDamageForTeam(team: TeamOfPokemon) {
    const tableOfTypeFromTeam = getAllTypesFromTeam(team);
    const doubleDamageFrom = await getRelationDamageFromTypes(tableOfTypeFromTeam, "double_damage_from");
    const doubleDamageTo = await getRelationDamageFromTypes(tableOfTypeFromTeam, "double_damage_to");
    const halfDamageFrom = await getRelationDamageFromTypes(tableOfTypeFromTeam, "half_damage_from");
    const halfDamageTo = await getRelationDamageFromTypes(tableOfTypeFromTeam, "half_damage_to");
    const noDamageFrom = await getRelationDamageFromTypes(tableOfTypeFromTeam, "no_damage_from");
    const noDamageTo = await getRelationDamageFromTypes(tableOfTypeFromTeam, "no_damage_to");

    const tableOfWeaknessDefense = await calculateWeakness(doubleDamageFrom, halfDamageFrom, noDamageFrom);
    const tableOfWeaknessAttack = await calculateWeakness(doubleDamageTo, halfDamageTo, noDamageTo)

    getWeaknessesTypesOfATeam(tableOfWeaknessDefense, tableOfWeaknessAttack);
}

function getAllTypesFromTeam(team: TeamOfPokemon) {
    const result = new Set<string>();

    for (let i = 1; i < 7; i++) {
        const numberOfPokemon = "pokemon_" + i;

        if (team[numberOfPokemon as keyof TeamOfPokemon]) {

            typeof team[numberOfPokemon as keyof TeamOfPokemon]?.types.map(pokemonType => {
                result.add(pokemonType.type.name)
            });
        }
    }

    const tableOfTypeFromTeam = Array.from(result);
    return tableOfTypeFromTeam;
}

async function getRelationDamageFromTypes(tableOfType: string[], damage: keyof PokemonWeakness['damage_relations']): Promise<string[]> {

    const result = new Set<string>();

    for (let type of tableOfType) {
        let pokemonWeakness = await getRelationDamageOfType(type)
        if (!pokemonWeakness) continue;

        pokemonWeakness.damage_relations[damage].map(type => {
            result.add(type.name);
        });
    }

    const tableOfResult = Array.from(result);
    return tableOfResult;
}

export async function calculateWeakness(doubleDamage: string[], halfDamage: string[], noDamage: string[]) {

    const tableOfAllTypes = await getTypes();
    if (!tableOfAllTypes) return [];

    const scores: Record<string, number> = {};

    tableOfAllTypes.forEach((type) => {
        scores[type] = 1.0;
    })

    doubleDamage.forEach((type) => {
        if (scores[type]) {
            scores[type] *= 2;
        }
    })

    halfDamage.forEach((type) => {
        if (scores[type]) {
            scores[type] *= 0.5;
        }
    })

    noDamage.forEach((type) => {
        if (scores[type]) {
            scores[type] *= 0;
        }
    })

    const tableOfResult = Object.entries(scores);
    return tableOfResult;
}

function getWeaknessesTypesOfATeam(tableOfWeaknessDefense: [string, number][], tableOfWeaknessAttack: [string, number][] ) {
    const tableOftypesWeakDefense: string[] = [];

    tableOfWeaknessDefense.filter(([typeName, score]) => {
        if (score > 1)
            tableOftypesWeakDefense.push(typeName);
    } );

    const tableOftypesWeakAttack: string[] = [];

    tableOfWeaknessAttack.filter(([typeName, score]) => {
        if(score < 1)
            tableOftypesWeakAttack.push(typeName);
    } );

    showWeaknessOfTeam(tableOftypesWeakDefense, tableOftypesWeakAttack);
}

function showWeaknessOfTeam(tableOftypesWeakDefense: string[], tableOftypesWeakAttack : string[]) {
    const teamContainer = document.getElementById('div-pokemon');
    if (!teamContainer) return;

    let defenseWeakHTML = "";
    let attackWeakHTML = "";

    for (const type of tableOftypesWeakDefense) {
        defenseWeakHTML += `<img src="src/img/${type}.png" alt="Type ${type}">`;
    }

    for (const type of tableOftypesWeakAttack) {
        attackWeakHTML += `<img src="src/img/${type}.png" alt="Type ${type}">`;
    }

    teamContainer.innerHTML +=
        `<div id="weakness-pokemon">
            <div class="defense-weakness">
                <p>Defense weaknesses of the team :</p>
                    ${defenseWeakHTML || `<p>Your team doesn't have defense weakness !</p>`}
            </div>
            <div class="attack-weakness">
                <p>Attack weaknesses of the team :</p>
                    ${attackWeakHTML || `<p>Your team doesn't have attack weakness !</p>`}
            </div>
        </div>
    `;
}