const filterOptions = [
    {delimiter: `@`, value: `mention`},
    {delimiter: `/`, value: `command`},
    {delimiter: `~`, value: `dice`},
]

const chatCommands = [
    `roll`,
    `mute`
]

const diceRegex = {
    single: /^[Dd][1-9]\d*$/,
    multi: /^[1-9]\d*[Dd][1-9]\d*$/,
    sequence: /^([1-9]\d*)?[Dd][1-9]\d*([.]([1-9]\d*)?[Dd][1-9]\d*)+$/,
}

const chatOptions = {
    optionFromDelimiter: function (delimiterText: string) {
        let output = {
            result: false,
            type: ``
        }
        for (let j = 0; j < filterOptions.length; j++) {
            if (delimiterText === filterOptions[j].delimiter) {
                output.result = true;
                output.type = filterOptions[j].value;
            }
        }
        return output;
    },
    optionRegex: /([@~\/])/g,
    validate: {
        command: function (input: string) {
            for (let command of chatCommands) {
                if (command === input) return true;
            }
            return false
        },
        dice: {
            single: function (diceText: string) {
                return diceRegex.single.test(diceText);
            },
            multi: function (diceText: string) {
                return diceRegex.multi.test(diceText);
            },
            sequence: function (diceText: string) {
                return diceRegex.sequence.test(diceText);
            },
            all: function (diceText: string) {
                if (diceRegex.single.test(diceText)) return true;
                if (diceRegex.multi.test(diceText)) return true;
                return diceRegex.sequence.test(diceText);
            }
        }
    },
    values: {
        chatCommands: chatCommands,
        dice: diceRegex
    }
}
export default chatOptions;