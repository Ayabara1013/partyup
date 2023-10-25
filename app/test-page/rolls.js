
export class Results {
  constructor(sum, rolls, mods) {
    this.sum = sum ?? 0;
    this.rolls = {
      d4: rolls?.d4 ?? new Roll(),
      d6: rolls?.d6 ?? new Roll(),
      d8: rolls?.d8 ?? new Roll(),
      d10: rolls?.d10 ?? new Roll(),
      d12: rolls?.d12 ?? new Roll(),
      d20: rolls?.d20 ?? new Roll(),
      d100: rolls?.d100 ?? new Roll(),
    };
    this.mods = mods ?? {};             // this will be an object of modifiers, like { strength: new Modifier(), proficiency: new Modifier() }
  }
}

// const rollTemplate = [`quantity`, `die`, `type`];

export class Roll {
  constructor(quantity, die, type) {
    this.quantity = quantity ?? 0;
    this.die = die ?? 0;
    this.type = type ?? null;
  }
}

export class Modifier {
  constructor(value, source, type) {
    this.value = value ?? 0;      // value is the number of the modifier, like 2 or 5 
    this.source = source ?? null; // source is the name of the modifier, like 'strength' or 'proficiency'
    this.type = type ?? null;     // type is either 'flat' or 'multiplier' // OR // type will be something like proficiency, fire, etc. // should this be a tags array?
  }
}




/**
 * @param {*} val 
 * @returns 
 */
export function rollDie(val) {
  let result = Math.floor(Math.random() * val) + 1;
  // console.log(`rolled ${result} on a d${val}`)
  return result;
}




export function ParseCommand(Command) {

}




// example rolls

const comm1 = '!roll 2d6+1d10+5';
const comm2 = `!roll 2d6 1d10 5`;
const comm3 = `!roll 2d6 + slashing 1d10 fire + 5 strength`;
const comm4 = `!roll 2d6 slashing 1d10 fire 5 strength`;
const comm5 = `!roll 2d6 slashing+1d10 fire+5 strength`; // this as a spaced plus, as well as a non spaced plus
const comm6 = `!roll 2d6 slashing+1d10 fire + 5 strength`; // this as a spaced plus, as well as a non spaced plus
const comm7 = `!roll 2d6(slash)+1d10(fire)+ 5 str`;         //this now uses brackets, do we want to allow brackets? it also has a shortened STR modifier
const comm8 = `roll 2d6 SLASHING + 1d10 FIRE + 5 STR`;      // this is all caps, do we want to allow all caps? 

 /** 
 * @param {*} command this will be a string, like '!roll 2d6+1d10+5' OR '!roll 2d6 1d10 5'
 */
export function roll(command) {
  // add the rolls to an array?
  // const rolls = {
  //   rolls: [],
  //   mods: [],
  // }

  // const results = '';

  const input = command || `!roll 2d6 + 1d10 fire + 5 strength`;

  // console.log(input.split(' ')[0].slice(1))
  // const commandType = input.split(' ')[0].slice(1);

  // const pattern= /(\S+)\s|([^+\-]+)|[+\-]\s*[^+\-]+/g;
  // const pattern = /(\S+[^+-]*)|[-+](\s*\S+[^+-]*)|([^+-]*)/g;
  // const pModifier = /[+-]/g;

  // const pattern = {
  //   command: /(!\w+)/g,
  //   dieRoll: /(\d+d\d+)/g,
  // }

  const regex = [
    { pattern: /(!\w+)/g, type: 'command' },
    { pattern: /(?:\+ )?\d+d\d+(?=\s[+\-])/g, type: 'basic roll' }, // the /s may not be good
    // { pattern: /(?:\+ )?\d+d\d+/g, type: 'basic roll' }, // the /s may not be good
  ];

  regex.forEach(({ pattern, type }) => {
    const matches = input.match(pattern);

    if (matches) {
      console.log(type, matches);

      // if (type === 'basic roll') {
      //   console.log(matches[0])
      // }
    }
  })


  // create the parts;
  // const parts = input.match(pattern.command);

  // console.log(parts);



  // const input = "Hello world, hello universe!";

  // const output = [];

  // // Define an array of objects with patterns and actions
  // const regexPatterns = [
  //   { pattern: /hello/g, action: "Found 'hello'" },
  //   { pattern: /world/g, action: "Found 'world'" },
  //   { pattern: /universe/g, action: "Found 'universe'" },
  // ];
  
  // // Iterate through the patterns and perform actions
  // regexPatterns.forEach(({ pattern, action }) => {
  //   const matches = input.match(pattern);
  //   if (matches) {
  //     // console.log(action);
  //     console.log(matches);

  //     matches.forEach((match) => {
  //       output.push(match);
  //     });
  //   }
  // });

  // console.log(output)
  



  // if (parts.length < 2) {
  //   return `invalid command`;
  // }


  // return results;

}



// /**
//  * this function takes in an array, I may want to change it to an object? Im not sure yet
//  * @param {*} rolls array
//  * @returns object
//  */
// export function roll(rolls) {
//   const results = new Results();

//   // console.log(`--- rolling dice ---`);

//   for (const item of rolls) {
//     let result = 0;
//     console.log(item, item.length > 2 ? `typed` : `untyped`);

//     // if (item.length > 2) {
//     //   console.log(`this one has a type!`)
//     // }

//     if (typeof item[1] === 'number') { // roll the die
//       // console.log(`rolling ${item[0]}d${item[1]}`)

//       for (let i = 0; i < item[0]; i++) {
        

//         result = rollDie(item[1]);
//         results.rolls[`d${item[1]}`].push(result);
//         results.sum += result;

//         // console.log(`rolled ${result} on a d${val[1]}, sum is now ${results.sum}`)
//       }
//     }
//     else if (typeof item[1] === 'string') { // add the modifier
//       console.log(`adding [${item[0]}] from [${item[1]}]`)

//       result = item[0];
//       results.mods[item[1]] = result;
//       // console.log(`added ${result} to mods.${val[1]}`)
//       results.sum += result;
//       // console.log(`sum is now ${results.sum}`)
//     }

//   }

//   return results;
// }



// export function typedRoll(rolls) {
//   const results = new Results();
//   let rollsArray = [];
  
//   for (const item of rolls) {
//     console.log(item);
//   }

//   for (const item of rollsArray) {
//     console.log(item);

//     let roll = rollDie(item.die);
    
//   }

//   console.log(rollsArray);
// }







// /**
//  * @param {*} rolls
//  * @returns
//  */
// export function parseRolls(rolls) {
//   let string = "";

//   for (let val = 0; val < rolls.length; val++) {
//     if (rolls[val][0] !== undefined) {
//       string += rolls[val][0];
//     }
//   }

//   return string;
// }


export function displayRollResults() {
  return `--- displaying roll results ---`;
}


// /** 
//  * @param {*} array 
//  * @param {*} complexity - simple, verbose
//  */
// export function displayRollResults(array, sum, complexity) {
//   let string = '';
//   let append = 'd';

//   switch (complexity) {
//     case 'modifiers':
//       for (const val of array) {
//         if (typeof val === 'number') {
//           string += `${val} + `;
//         }
//         else if (typeof val === 'string') {
        
//         }
//       }
//     case 'verbose':
//       for (const roll of array) {
//         if (Array.isArray(roll)) {
//           string += `${roll[0]} (${roll[1]}) + `;
//         }
//         else string += roll;
//       }
//       break;
//     default:
//       for (const roll of array) {
//         if (Array.isArray(roll)) {
//           string += `${roll[0]} + `;
//         }
//         else string += `${roll} + `;
//       }
//       break;
//   }

//   if (string.endsWith(' + ')) string = string.slice(0, -3);

//   string += ` = ${sum}`;

//   console.log(`--- displaying roll results ---`)
//   console.log(string);
// }



// export function displayRollResults(array, complexity) {
//   const rolls = array.rolls;
//   const mods = array.mods;
//   let result = '';

//   switch (complexity) {
//     // case 'verbose':
//     //   break;
//     default:
//       for (const item in rolls) {
//         if (rolls[item].length > 0) {
//           console.log(`handling ${item}...`)
//           console.log(item, rolls[item]);
          
//           for (const value of rolls[item]) {

//             if (typeof value === 'array') {
//               result += `${value[0]} (${value[1]}) + `;
//             }
//             else {
//               result += `${value} + `;
//             }
//           }
//         }
//       }
      
//       for (const item in mods) {
//         console.log(`handling ${item}...`)
//         result += `${mods[item]} (${item.slice(0, 3)}) + `;
//       }
//   }

//   result = result.slice(0, -3);

//   return result;
// }






// export function roll3(rolls) {

// }