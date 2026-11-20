type GameSystem = {
    title: string;
    value: string;
    // Premade campaigns games of this system can run. Add a name to list it; don't rename one that games already
    // use (game.premade stores the name itself; fix a typo there with one update in the SQL editor).
    premade: string[];
};

const gameSystemArray: GameSystem[] = [
    {
        title: `Dungeons & Dragons 5e`,
        value: `dnd5e`,
        premade: [
            `Lost Mine of Phandelver`,
            `Curse of Strahd`,
            `Tomb of Annihilation`,
            `Storm King's Thunder`,
            `Waterdeep: Dragon Heist`,
            `Baldur's Gate: Descent into Avernus`,
            `Icewind Dale: Rime of the Frostmaiden`,
            `The Wild Beyond the Witchlight`,
        ],
    },
    {
        title: `Pathfinder 2e`,
        value: `pf2e`,
        premade: [`Age of Ashes`, `Extinction Curse`, `Abomination Vaults`, `Strength of Thousands`, `Kingmaker`],
    },
    {title: `Fate Accelerated`, value: `fae`, premade: []},
    {title: `Savage Worlds`, value: `swade`, premade: []},
]
export const gameSystems = {
    array: gameSystemArray,
    valueToTitle: Object.fromEntries(gameSystemArray.map((s) => [s.value, s.title])) as Record<string, string>,
}
