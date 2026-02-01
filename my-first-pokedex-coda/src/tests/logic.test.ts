import { expect, test } from 'vitest';
import {getIdFromUrl} from "../utils/regex";
import {calculateWeakness} from "../team/weakness-team.ts";

test("extract id from URL", () => {
    const url = "https://pokeapi.co/api/v2/pokemon/159/";

    const result = getIdFromUrl(url);

    expect(result).toBe("159");
})

test("calculates the damage taken by an attack to a fire type pokemon", async () => {
    const doubleDamageFrom = ["ground", "rock", "water"];
    const halfDamageFrom = ["bug", "steel", "fire", "grass", "ice", "fairy"];
    const noDamageFrom: string[] = [];

    const result = await calculateWeakness(doubleDamageFrom, halfDamageFrom, noDamageFrom);

    expect(result).toContainEqual(["normal", 1]);
    expect(result).toContainEqual(["ground", 2]);
    expect(result).toContainEqual(["bug", 0.5]);
})

test("calculate the damage by an attack of a psychic type pokemon", async () => {
    const doubleDamageTo = ["fighting", "poison", "water"];
    const halfDamageTo = ["steel", "psychic"];
    const noDamageTo = ["dark"];

    const result = await calculateWeakness(doubleDamageTo, halfDamageTo, noDamageTo);

    expect(result).toContainEqual(["normal", 1]);
    expect(result).toContainEqual(["dark", 0]);
    expect(result).toContainEqual(["psychic", 0.5]);
    expect(result).toContainEqual(["poison", 2]);
})