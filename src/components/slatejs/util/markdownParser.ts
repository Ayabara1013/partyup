import {MENTION_RE} from "@/lib/supabase/util/mentions";

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

        return newLineParserDisplay(text)

    },
}


export default markdownParser;