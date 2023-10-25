import { ui } from "@/util/ui";
import { diceConcat, dieRegex, isNumber, statRegex } from "@/util/constants";
import toast from "react-hot-toast";
import { statLookUp } from "@/util/character/statLookUp";

const validateCommand = (input, gameType, character) => {
  let command = input.split(' ')[0];
  let cleanArgs = input.replace(command, '').trim();
  switch (command) {

    case '!r':
      let formattedDice = [];
      let args = cleanArgs.split(diceConcat);
      let posNeg = cleanArgs.match(diceConcat)
      if (posNeg.length !== args.length){
        posNeg = ['+'].concat(posNeg);
      }
      for (let i in posNeg){
        posNeg[i] = (posNeg[i] === '+') ? 1 : -1;
      }

      for (let i in args) {
        let cleanArg = args[i].trim();

        if (dieRegex(cleanArg)) {// check if die
          let quantity = parseInt(cleanArg.split('d')[0]);
          let dieSize = parseInt(cleanArg.split('d')[1].split('+')[0]);
          let type = cleanArg.split(' ')[1];
          let validType = statLookUp[gameType].damageType.includes(type);

          formattedDice.push([quantity, dieSize * posNeg[i], ...validType?[type]:[]]);
        } else if(statLookUp[gameType].abilityScores.includes(cleanArg)){// check if stat mod
          let abilityScore = cleanArg;
          let modifier = character.stats.abilityScores[abilityScore].modifier();

          formattedDice.push([modifier * posNeg[i], abilityScore]);
        } else if(statLookUp[gameType].skills.includes(cleanArg)){// check if skill mod
          let skill = cleanArg;
          let modifier = character.stats.skills[skill].modifier();

          formattedDice.push([modifier, skill]);
        } else if(isNumber(cleanArg)){// check if number
          let number = parseInt(cleanArg);
          formattedDice.push([number * posNeg[i]]);
        }
      }
      return {
        command: 'roll command',
        dice: formattedDice
      };

    default:
      return {
        command: 'invalid command',
      }
  }
}

const sortByKey = (array, key) => {
  return array.sort(function (a, b) {
    let x = a[key];
    let y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  })
}

const addArrayToArray = (array, arrayToAdd, key) => {
  for (let newMsg of arrayToAdd) {
    let index = array.indexOf(array.find(msg => msg[key] === newMsg[key]));
    if (index === -1) {
      array.push(newMsg);
    } else {
      array[index] = newMsg;
    }
  }
}

const grabMatches = (regex, string) => {
  let matches = [];
  let match = regex.exec(string);
  console.log(match)
  return matches;
}

const capitalizeWords = (string) => {
  return string.split(" ").map(word => {
    if (word.length > 2) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    } else {
      return word;
    }
  }).join(" ");
}

export {
  sortByKey,
  addArrayToArray,
  validateCommand,
  capitalizeWords
};