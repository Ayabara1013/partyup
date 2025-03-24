import chatOptions from "@/javascript/assets/chat/chatOptions";

function getRandomInt(min = 1000, max = 100000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function parseOptionText(text) {
  return text.split(`{`)[1]?.split(`}`);
}

function parseDieTextIntoObject(die) {
  let splitDie = die.split('d')
  let multiRoll = splitDie[0].length > 0;
  return {
    rolls: multiRoll ? parseInt(splitDie[0]) : 1,
    size: parseInt(splitDie[1]),
  }
}

const messageParser = {
  parseDice: function (text) {
    let diceText = []
    let textFragments = text.toLowerCase().split(`~`);
    console.log(text);
    console.log(textFragments);
    for (let i = 0; i < textFragments.length; i++) {
      if (i !== 0) {
        let [die] = parseOptionText(textFragments[i]);
        if (chatOptions.validate.dice.all(die)) diceText.push(die);
      }
    }
    let output = {};
    for (let dieText of diceText) {
      let rollingDice = [];
      let multiCheck = dieText.split(`.`)
      if (multiCheck.length > 1) {
        for (let die of multiCheck) {
          rollingDice.push(parseDieTextIntoObject(die));
        }
      } else {
        rollingDice.push(parseDieTextIntoObject(dieText))
      }
      let text = ``;
      let total = 0;
      for (let die of rollingDice) {
        text += `${die.rolls}d${die.size} => `
        for (let r = 0; r < die.rolls; r++) {
          let tempRoll = getRandomInt(1, die.size)
          total += tempRoll;
          text += `${tempRoll}, `;
        }
        text = text.slice(0, -2);
        text += `\n`
      }
      text = text.slice(0, -1);
      output = {text, total}
    }
    return `You rolled a total of ${output.total}. Your roles:\n${output.text}`;
  }
}
export default messageParser;