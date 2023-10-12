
export class Results {
  constructor(sum, rolls, mods) {
    this.sum = sum ?? 0;
    this.rolls = {
      d4: rolls?.d4 ?? [],
      d6: rolls?.d6 ?? [],
      d8: rolls?.d8 ?? [],
      d10: rolls?.d10 ?? [],
      d12: rolls?.d12 ?? [],
      d20: rolls?.d20 ?? [],
      d100: rolls?.d100 ?? [],
    };
    this.mods = mods ?? {};
  }
}

const rollTemplate = [`quantity`, `die`, `type`];

export class Roll {
  constructor(quantity, die, type) {
    this.quantity = quantity ?? 1;
    this.die = die ?? 6;
    this.type = type ?? null;
  }
}


/**
 * this function takes in an array, I may want to change it to an object? Im not sure yet
 * @param {*} rolls array
 * @returns object
 */
export function roll(rolls) {
  const results = new Results();

  // console.log(`--- rolling dice ---`);

  for (const item of rolls) {
    let result = 0;
    console.log(item, item.length > 2 ? `typed` : `untyped`);

    // if (item.length > 2) {
    //   console.log(`this one has a type!`)
    // }

    if (typeof item[1] === 'number') { // roll the die
      // console.log(`rolling ${item[0]}d${item[1]}`)

      for (let i = 0; i < item[0]; i++) {
        

        result = rollDie(item[1]);
        results.rolls[`d${item[1]}`].push(result);
        results.sum += result;

        // console.log(`rolled ${result} on a d${val[1]}, sum is now ${results.sum}`)
      }
    }
    else if (typeof item[1] === 'string') { // add the modifier
      console.log(`adding [${item[0]}] from [${item[1]}]`)

      result = item[0];
      results.mods[item[1]] = result;
      // console.log(`added ${result} to mods.${val[1]}`)
      results.sum += result;
      // console.log(`sum is now ${results.sum}`)
    }

  }

  return results;
}



export function typedRoll(rolls) {
  const results = new Results();
  let rollsArray = [];
  
  for (const item of rolls) {
    console.log(item);
  }

  for (const item of rollsArray) {
    console.log(item);

    let roll = rollDie(item.die);
    
  }

  console.log(rollsArray);
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



/** 
 * @param {*} rolls 
 * @returns 
 */
export function parseRolls(rolls) {
  let string = "";

  for (let val = 0; val < rolls.length; val++) {
    if (rolls[val][0] !== undefined) {
      string += rolls[val][0];
    }
  }

  return string;
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



export function displayRollResults(array, complexity) {
  const rolls = array.rolls;
  const mods = array.mods;
  let result = '';

  switch (complexity) {
    // case 'verbose':
    //   break;
    default:
      for (const item in rolls) {
        if (rolls[item].length > 0) {
          console.log(`handling ${item}...`)
          console.log(item, rolls[item]);
          
          for (const value of rolls[item]) {

            if (typeof value === 'array') {
              result += `${value[0]} (${value[1]}) + `;
            }
            else {
              result += `${value} + `;
            }
          }
        }
      }
      
      for (const item in mods) {
        console.log(`handling ${item}...`)
        result += `${mods[item]} (${item.slice(0, 3)}) + `;
      }
  }

  result = result.slice(0, -3);

  return result;
}






export function roll3(rolls) {

}