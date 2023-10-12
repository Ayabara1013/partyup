
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

const rol


// /** 
//  * @param {*} dice 
//  * @returns 
//  */
// export function roll(dice) {
//   let sum = 0;
//   let rolls = []; // [[2, on a d4], [3, on a d6]] >> [[2, 4], [3, 6]]
  
//   console.log(dice)

//   for (const val of dice) {

//     if (Array.isArray(val)) {
//       console.log(`[${val[0]}d${val[1]}] is array`);
//       console.log(`rolling ${val[0]}d${val[1]}`);

//       for (let num = 0; num < val[0]; num++) {
//         result = rollDie(val[1]);
//         sum += result;
//         rolls.push([result, val[1]]);
//       }
//     }
//     else {
//       // this is not an array, meaning its not a die roll (for now?) so we just add or sub the values

//       console.log(`item is not a die roll*, adding ${val}`);

//       sum += val;
//       rolls.push(val);
//     }

//     console.log(`current sum: ${sum}`);
//   }

//   // for (const item in rolls) console.log(rolls[item]);
  
//   const results = {
//     sum: sum,
//     rolls: rolls
//   };

//   console.log(`displaying all results: `)
//   console.log(results);

//   return results;
// }



/**
 * text goes here
 * @param {*} rolls array
 * @returns object
 */
export function roll(rolls) {
  const results = new Results();

  console.log(`--- rolling dice ---`);

  for (const val of rolls) {
    console.log(`[ ${typeof val[1] === 'number' ? 'd' : 'mod, '}${val[1]} ]`);

    let result = 0;

    if (typeof val[1] === 'number') { // roll the die
      for (let i = 0; i < val[0]; i++) {
        result = rollDie(val[1]);

        results.rolls[`d${val[1]}`].push(result);
        results.sum += result;

        console.log(`rolled ${result} on a d${val[1]}, sum is now ${results.sum}`)
      }
    }
    else if (typeof val[1] === 'string') { // add the modifier
      result = val[0];
      results.mods[val[1]] = result;
      console.log(`added ${result} to mods.${val[1]}`)
      results.sum += result;
      console.log(`sum is now ${results.sum}`)
    }

  }

  return results;
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



/** 
 * @param {*} array 
 * @param {*} complexity - simple, verbose
 */
export function displayRollResults(array, sum, complexity) {
  let string = '';
  let append = 'd';

  switch (complexity) {
    case 'modifiers':
      for (const val of array) {
        if (typeof val === 'number') {
          string += `${val} + `;
        }
        else if (typeof val === 'string') {
        
        }
      }
    case 'verbose':
      for (const roll of array) {
        if (Array.isArray(roll)) {
          string += `${roll[0]} (${roll[1]}) + `;
        }
        else string += roll;
      }
      break;
    default:
      for (const roll of array) {
        if (Array.isArray(roll)) {
          string += `${roll[0]} + `;
        }
        else string += `${roll} + `;
      }
      break;
  }

  if (string.endsWith(' + ')) string = string.slice(0, -3);

  string += ` = ${sum}`;

  console.log(`--- displaying roll results ---`)
  console.log(string);
}



export function displayRollResults2(array, complexity) {
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
            result += `${value} + `;
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