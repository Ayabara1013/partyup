const parserRegex = {
    dice: /^(\d+)(?:[dD](\d+))?/,
    flat: /\+(\d+)/,
    label: /\[([^\]]+)]/,
    group: /(?:^|\s*\+\s*)(\d+)\s*\*\s*\(([^()]*)\)/g,
};

class DiceRoll {
    constructor(
        public rollTotal: number,
        public rollLog: string[],
        public label: string = ""
    ) {
    }
}

const getRandomInt = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;


const messageParser = {
    parseDice: (text: string) => {
        let cleanedText = text
            .replace(/^\/(?:roll|r)\s*/, "")
            .trim();

        const diceRolls: DiceRoll[] = [];

        const splitTerms = (text: string) =>
            text
                .split(/\s+\+\s+/)
                .map((s) => s.trim())
                .filter(Boolean);

        cleanedText = cleanedText
            .replace(parserRegex.group, (_match, multiplierText, groupText) => {
                const multiplier = Number(multiplierText);

                for (const dice of splitTerms(groupText)) {
                    const result = diceRoll(dice);
                    if (!result) continue;

                    result.rollTotal *= multiplier;
                    result.rollLog.push(`Multiplied by ${multiplier}`);
                    diceRolls.push(result);
                }

                return "";
            })
            .replace(/^\s*\+\s*/, "")
            .trim();

        for (const dice of splitTerms(cleanedText)) {
            const result = diceRoll(dice);
            if (result) diceRolls.push(result);
        }

        const resultText = diceRolls
            .map((roll) => `${roll.rollTotal}${roll.label ? ` [${roll.label}]` : ""}`)
            .join(" + ");

        return {
            log: diceRolls,
            resultText,
        };
    }
}

const diceRoll = (diceText: string): DiceRoll | null => {
    const text = diceText.trim();

    const diceMatch = text.match(parserRegex.dice);
    if (!diceMatch) return null;

    const countOrValue = Number(diceMatch[1]);
    const range = diceMatch[2] ? Number(diceMatch[2]) : null;

    const flat = Number(text.match(parserRegex.flat)?.[1] ?? 0);
    const label = text.match(parserRegex.label)?.[1] ?? "";

    let rollTotal = 0;
    const rollLog: string[] = [];

    if (range !== null) {
        for (let i = 0; i < countOrValue; i++) {
            const roll = getRandomInt(1, range);
            rollTotal += roll;
            rollLog.push(`${countOrValue}d${range} | ${roll}`);
        }
    } else {
        rollTotal = countOrValue;
        rollLog.push(`${countOrValue}`);
    }

    if (flat) {
        rollTotal += flat;
        rollLog.push(`flat: ${flat}`);
    }

    return new DiceRoll(rollTotal, rollLog, label);
};

export default messageParser;