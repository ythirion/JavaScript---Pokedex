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

    const tableOfWeaknessDefense = await calculateWeaknessDefense(doubleDamageFrom, halfDamageFrom, noDamageFrom);
    const tableOfWeaknessAttack = await calculateWeaknessAttack(doubleDamageTo, halfDamageTo, noDamageTo)
}

export function getAllTypesFromTeam(team: TeamOfPokemon) {
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

export async function getRelationDamageFromTypes(tableOfType: string[], damage: keyof PokemonWeakness['damage_relations']): Promise<string[]> {

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

async function calculateWeaknessDefense(doubleDamageFrom: string[], halfDamageFrom: string[], noDamageFrom: string[]) {

    const tableOfAllTypes = await getTypes();
    if (!tableOfAllTypes) return;

    const scores: Record<string, number> = {};

    tableOfAllTypes.forEach((type) => {
        scores[type] = 1.0;
    })

    doubleDamageFrom.forEach((type) => {
        if (scores[type]) {
            scores[type] *= 2;
        }
    })

    halfDamageFrom.forEach((type) => {
        if (scores[type]) {
            scores[type] *= 0.5;
        }
    })

    noDamageFrom.forEach((type) => {
        if (scores[type]) {
            scores[type] *= 0;
        }
    })

    const tableOfResult = Object.entries(scores);
    return tableOfResult;
}

async function calculateWeaknessAttack(doubleDamageTo: string[], halfDamageTo: string[], noDamageTo: string[]) {

    const tableOfAllTypes = await getTypes();
    if (!tableOfAllTypes) return;

    const scores: Record<string, number> = {};

    tableOfAllTypes.forEach((type) => {
        scores[type] = 1.0;
    })

    doubleDamageTo.forEach((type) => {
        if (scores[type]) {
            scores[type] *= 2;
        }
    })

    halfDamageTo.forEach((type) => {
        if (scores[type]) {
            scores[type] *= 0.5;
        }
    })

    noDamageTo.forEach((type) => {
        if (scores[type]) {
            scores[type] *= 0;
        }
    })

    const tableOfResult = Object.entries(scores);
    return tableOfResult;
}
