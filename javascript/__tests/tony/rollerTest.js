import { CreateCharacter, validateCommand } from "gb-temp-dnd";

export default function rollerTest(){
  let character = CreateCharacter.dnd(
    {
      strength: 15,
    },
    {
      athletics: {
        proficiency: true,
        expertise: false,
      },
      sleightOfHand: {
        proficiency: true,
        expertise: true,
      }
    },
    4);
  let commands =[
    '!r 1d20 fire - 2d12 acid + strength + 2',
    '!r 3d6 psychic + 3d20 - 4d4 - athletics + 2',
    '!r 6d4 lightning - 2d12 + intelligence - 2'
  ]
  let outputDice = [];
  let rollResults = [];
  for (const command of commands) {
    outputDice.push(validateCommand(command, 'dnd', character).dice);
  }
  for (const dice of outputDice) {
    rollResults.push(i);
  }

  for(let i = 0; i < outputDice.length; i++){
    console.log(commands[i]);
    console.log(outputDice[i]);
    console.log(rollResults[i]);
  }
}