const gameSystemArray = [
    {
        title: `Dungeons & Dragons 5e`,
        value: `dnd5e`
    },
    {
        title: `Pathfinder 2e`,
        value: `pf2e`
    },
    {
        title: `Fate Accelerated`,
        value: `fae`
    },
    {
        title: `Savage Worlds`,
        value: `swade`
    },
]
export const gameSystems = {
    array: gameSystemArray,
    valueToTitle: {
        [gameSystemArray[0].value]: gameSystemArray[0].title,
        [gameSystemArray[1].value]: gameSystemArray[1].title,
        [gameSystemArray[2].value]: gameSystemArray[2].title,
        [gameSystemArray[3].value]: gameSystemArray[3].title,
    }
}