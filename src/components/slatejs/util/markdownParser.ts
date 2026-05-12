import chatOptions from "@/lib/assets/chatOptions";

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

        function optionParserDisplay(text: string, baseElement: any) {
            // let textFragments = text.split(chatOptions.optionRegex);
            // if (textFragments.length > 1) {
            //   for (let i = 0; i < textFragments.length; i++) {
            //     if (i === 0) {
            //       baseElement.children.push({text: textFragments[0]})
            //     } else if (i % 2 === 1) {
            //       let result = chatOptions.optionFromDelimiter(textFragments[i])
            //       if (result.result && i + 1 < textFragments.length) {
            //         optionIntoObject[result.type](textFragments[i + 1], baseElement, players);
            //       }
            //       i++;
            //     }
            //   }
            //   return;
            // }
            baseElement.children.push({text: text});
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