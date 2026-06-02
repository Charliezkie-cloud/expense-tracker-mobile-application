import { CONSTELLATION_NAMES } from "../application/data";

/**
 * Generate random star constellations names for ya ;D
 * @param maxWords The maximum words
 */
export function generateRandomName(maxWords: number = 2) {
    let generatedName: string[] = [];

    for (let i = 0; i < maxWords; i++) {
        const generatedNumber = getRandomIntInclusive(0, CONSTELLATION_NAMES.length - 1);
        const randomName = CONSTELLATION_NAMES[generatedNumber];

        if (!generatedName.includes(randomName))
            generatedName.push(randomName);
        else
            i--;
    }

    return generatedName.join(" ");
}

/**
 * Generates random int inclusive for you ;D
 * @param min The minimum number
 * @param max The maximum number
 */
function getRandomIntInclusive(min: number, max: number) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}