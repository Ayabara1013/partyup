import chatOptions from "@/lib/assets/chatOptions";

// Same format as messageUtil: <@userId>
const MENTION_RE = /<@([0-9a-fA-F-]{36})>/g;

function parseOption(text: string) {
    return text.split(`{`)[1]?.split(`}`);
}

const markdownParser = {
    toDisplay: function (text: string, players: Array<any>) {

        function newLineParserDisplay(text: string) {
            let baseArray = [];
            let newLineSplit = text.split('\n');
            for (let i = 0; i < newLineSplit.length; i++) {
                baseArray.push(paragraphParserDisplay(newLineSplit[i]));
            }
            return baseArray;
        }

        function paragraphParserDisplay(text: string) {
            let baseElement = {
                type: `paragraph`,
                children: []
            }
            optionParserDisplay(text, baseElement);
            return baseElement;
        }

        // Splits out <@userId> mentions into mention badges; everything else stays text
        function optionParserDisplay(text: string, baseElement: any) {
            let last = 0;
            for (const match of text.matchAll(MENTION_RE)) {
                const index = match.index ?? 0;
                if (index > last) baseElement.children.push({text: text.slice(last, index)});
                const player = players.find((p: any) => p?.id === match[1]);
                baseElement.children.push({
                    type: `badge`,
                    featureType: `mention`,
                    value: match[0],
                    children: [{text: `@${player?.name ?? `Unknown`}`}]
                });
                last = index + match[0].length;
            }
            if (last < text.length || baseElement.children.length === 0) {
                baseElement.children.push({text: text.slice(last)});
            }
        }

        function boldItalicParser(text: string, baseElement: any) {
            return {text};
        }

        return newLineParserDisplay(text)

    },
    // toEditor: function (text) {
    //   return newLineParser(text)
    // }
}

const optionIntoObject = {
    mention: function (text: string, baseElement: any, players: Array<any>,) {
        let [idOnly, restOfText] = parseOption(text);
        for (let player of players) {
            if (idOnly === player.id) {
                baseElement.children.push({
                    type: 'badge',
                    featureType: `mention`,
                    value: `@{${idOnly}}`,
                    children: [{text: `@${player.name}`}]
                })
                baseElement.children.push({text: restOfText});
                return;
            }
        }
        baseElement.children.push({text: text});
    },

    command: function (text: string, baseElement: any) {
        // let [commandOnly, restOfText] = parseOption(text);
        // if (chatOptions.validate.command(commandOnly)) {
        //   baseElement.children.push({
        //     type: 'badge',
        //     featureType: `command`,
        //     value: `/${commandOnly}`,
        //     children: [{text: `/${commandOnly}`}]
        //   })
        //   baseElement.children.push({text: restOfText});
        //   return;
        // }
        baseElement.children.push({text: text});
    },

    dice: function (text: string, baseElement: any) {
        let [dice, restOfText] = parseOption(text);
        if (chatOptions.validate.dice.all(dice)) {
            baseElement.children.push({
                type: 'badge',
                featureType: `dice`,
                value: `~${dice}`,
                children: [{text: `~${dice}`}]
            })
            baseElement.children.push({text: restOfText});
            return;
        }
        baseElement.children.push({text: text});
    }
}


export default markdownParser;