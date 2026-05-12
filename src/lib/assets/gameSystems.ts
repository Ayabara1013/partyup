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
    checkListArray: (refList: Array<any>) => {
        return [
            {ref: refList[0], checked: true, label: gameSystemArray[0].title, value: gameSystemArray[0].value},
            {ref: refList[1], checked: true, label: gameSystemArray[1].title, value: gameSystemArray[1].value},
            {ref: refList[2], checked: true, label: gameSystemArray[2].title, value: gameSystemArray[2].value},
            {ref: refList[3], checked: true, label: gameSystemArray[3].title, value: gameSystemArray[3].value},
        ]
    },
    valueToTitle: {
        [gameSystemArray[0].value]: gameSystemArray[0].title,
        [gameSystemArray[1].value]: gameSystemArray[1].title,
        [gameSystemArray[2].value]: gameSystemArray[2].title,
        [gameSystemArray[3].value]: gameSystemArray[3].title,
    }
}