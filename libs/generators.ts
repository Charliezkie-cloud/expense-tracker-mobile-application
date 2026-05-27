const constellationNames = [
    "Andromeda",
    "Antlia",
    "Apus",
    "Aquarius",
    "Aquila",
    "Ara",
    "Aries",
    "Auriga",
    "Bootes",
    "Caelum",
    "Camelopardalis",
    "Cancer",
    "Canes Venatici",
    "Canis Major",
    "Canis Minor",
    "Capricornus",
    "Carina",
    "Cassiopeia",
    "Centaurus",
    "Cepheus",
    "Cetus",
    "Chamaeleon",
    "Circinus",
    "Columba",
    "Coma Berenices",
    "Corona Australis",
    "Corona Borealis",
    "Corvus",
    "Crater",
    "Crux",
    "Cygnus",
    "Delphinus",
    "Dorado",
    "Draco",
    "Equuleus",
    "Eridanus",
    "Fornax",
    "Gemini",
    "Grus",
    "Hercules",
    "Horologium",
    "Hydra",
    "Hydrus",
    "Indus",
    "Lacerta",
    "Leo",
    "Leo Minor",
    "Lepus",
    "Libra",
    "Lupus",
    "Lynx",
    "Lyra",
    "Mensa",
    "Microscopium",
    "Monoceros",
    "Musca",
    "Norma",
    "Octans",
    "Ophiuchus",
    "Orion",
    "Pavo",
    "Pegasus",
    "Perseus",
    "Phoenix",
    "Pictor",
    "Pisces",
    "Piscis Austrinus",
    "Puppis",
    "Pyxis",
    "Reticulum",
    "Sagitta",
    "Sagittarius",
    "Scorpius",
    "Sculptor",
    "Scutum",
    "Serpens",
    "Sextans",
    "Taurus",
    "Telescopium",
    "Triangulum",
    "Triangulum Australe",
    "Tucana",
    "Ursa Major",
    "Ursa Minor",
    "Vela",
    "Virgo",
    "Volans",
    "Vulpecula"
];

/**
 * Generate random star constellations names for ya ;D
 * @param maxWords The maximum words
 */
export function generateRandomName(maxWords: number = 2) {
    let generatedName: string[] = [];

    for (let i = 0; i < maxWords; i++) {
        const generatedNumber = getRandomIntInclusive(0, constellationNames.length - 1);
        const randomName = constellationNames[generatedNumber];

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