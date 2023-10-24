import { ui } from "@/util/ui";
import { dieRegex } from "@/util/constants";
import toast from "react-hot-toast";

function validateCommand(input, character) {
    let args = input.split(' ');
    let command = args[0].slice(0,2);

    switch (command){
      case '!r':
        let dice = args;
        let formattedDice = [];
        dice.splice(0);
        for(let die of dice){
          if(dieRegex.test(die)){
            let quantity = parseInt(die.split('d')[0]);
            let dieSize = parseInt(die.split('d')[1].split('+')[0]);
            let modifier = parseInt(die.split('+')[1]);
            formattedDice.push({
                quantity, dieSize, modifier, type: null
            })
          }
        }
        return {
          command: 'roll',
          dice: formattedDice
        };
      default:
        return {
            command: 'invalid',
        }
    }
}

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    let x = a[key];
    let y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  })
}

function addArrayToArray(array, arrayToAdd, key) {
  for (let newMsg of arrayToAdd) {
    let index = array.indexOf(array.find(msg => msg[key] === newMsg[key]));
    if (index === -1) {
      array.push( newMsg);
    } else {
      array[index] = newMsg;
    }
  }
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