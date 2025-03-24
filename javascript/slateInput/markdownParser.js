import chatOptions from "@/javascript/assets/chat/chatOptions";

const markdownParser = {
  toDisplay: function (text, players) {

    function newLineParserDisplay(text) {
      let baseArray = [];
      let newLineSplit = text.split('\n');
      for (let i = 0; i < newLineSplit.length; i++) {
        baseArray.push(paragraphParserDisplay(newLineSplit[i]));
      }
      return baseArray;
    }

    function paragraphParserDisplay(text) {
      let baseElement = {
        type: `paragraph`,
        children: []
      }
      optionParserDisplay(text, baseElement);
      return baseElement;
    }

    function optionParserDisplay(text, baseElement) {
      let textFragments = text.split(chatOptions.optionRegex);
      if (textFragments.length > 1) {
        for (let i = 0; i < textFragments.length; i++) {
          if (i === 0) {
            baseElement.children.push({text: textFragments[0]})
          } else if (i % 2 === 1) {
            let result = chatOptions.optionFromDelimiter(textFragments[i])
            if (result.result && i + 1 < textFragments.length) {
              optionIntoObject[result.type](textFragments[i + 1], baseElement, players);
            }
            i++;
          }
        }
      } else {
        baseElement.children.push({text: text});
      }
    }

    function boldItalicParser(text, baseElement) {
      return {text};
    }

    return newLineParserDisplay(text)

  },
  // toEditor: function (text) {
  //   return newLineParser(text)
  // }
}

const optionIntoObject = {
  mention: function (text, baseElement, players,) {
    let playerName = ``;
    let [idOnly, restOfText] = parseOption(text);
    for (let playerId of players.playerIds) {
      if (idOnly === playerId) {
        playerName = players[playerId].uName;
        baseElement.children.push({
          type: 'badge',
          featureType: `mention`,
          value: `@{${idOnly}}`,
          children: [{text: `@${playerName}`}]
        })
        baseElement.children.push({text: restOfText});
        return;
      }
    }
    baseElement.children.push({text: text});
  },
  command: function (text, baseElement) {
    let [commandOnly, restOfText] = parseOption(text);
    if (chatOptions.validate.command(commandOnly)) {
      baseElement.children.push({
        type: 'badge',
        featureType: `command`,
        value: `/${commandOnly}`,
        children: [{text: `/${commandOnly}`}]
      })
      baseElement.children.push({text: restOfText});
      return;
    }
    baseElement.children.push({text: text});
  },
  dice: function (text, baseElement) {
    let [dice, restOfText] = parseOption(text);
    if (chatOptions.validate.dice.all(dice)) {
      baseElement.children.push({
        type: 'badge',
        featureType: `dice`,
        value: `~${dice}`,
        children: [{text: `~.${dice}`}]
      })
      baseElement.children.push({text: restOfText});
      return;
    }
    baseElement.children.push({text: text});
  }
}

function parseOption(text) {
  return text.split(`{`)[1]?.split(`}`);
}

export default markdownParser;