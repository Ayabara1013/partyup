// import { parse } from 'yargs';

// import { resolveMotionValue } from 'framer-motion';



export class Result {
  constructor(sum, totals, rolls, mods) {
    this.sum = 0;
    this.totals = [];
    this.rolls = {
      d4: [],
      d6: [],
      d8: [],
      d10: [],
      d12: [],
      d20: [],
      d100: [],
    };
    this.mods = [];
  }
}

export class Roll {
  constructor(operation, quantity, die, type) {
    this.operation = this.setOperation(operation);
    this.quantity = parseInt(quantity) ?? 0;
    this.die = parseInt(die) ?? 0;
    this.type = this.setType(type);
  }

  setOperation(operation) {
    if (operation === 'add' || operation === 'subtract') {
      return operation;
    }
    else if (operation === '+') {
      return 'add';
    }
    else if (operation === '-') {
      return 'subtract';
    }
    else {
      return 'add';
    }
  }

  setType(type) {
    if (type.length <= 1 && type[0] === '') {
      return [false]; // i am going to leave this as an array in case there would be any weird errors calling it later, ie type[0] === false? and so on
    }
    return type;
  }
}

class RollResult extends Roll { // can this be just made its own separate class? is there any benefit in linking it to Roll?
  constructor(operation, die, type) {
    super(operation, 1, die, type);
    this.result = this.getResult();
    // delete this.setType;
  }

  getResult() {
    return this.operation === 'add' ? rollDie(this.die) : this.operation === 'subtract' ? -rollDie(this.die) : `ERROR`;
  }
}

export class Modifier {
  constructor(operation, value, type, source) {
    this.operation = this.setOperation(operation); // operation is either 'add' or 'subtract'
    this.value = parseInt(value) ?? 0;      // value is the number of the modifier, like 2 or 5
    this.type = this.setType(type);     // type is either 'flat' or 'multiplier' // OR // type will be something like proficiency, fire, etc. // should this be a tags array?
    this.source = source ?? null; // source is the name of the modifier, like 'strength' or 'proficiency'
  }

  setOperation(operation) {
    if (operation === 'add' || operation === 'subtract') {
      return operation;
    }
    else if (operation === '+') {
      return 'add';
    }
    else if (operation === '-') {
      return 'subtract';
    }
    else {
      return 'add';
    }
  }

  setType(type) {
    if (type.length <= 1 && type[0] === '') {
      return [false]; // i am going to leave this as an array in case there would be any weird errors calling it later, ie type[0] === false? and so on
    }
    return type;
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

/**
 *
 * @param {*} input
 * @returns
 */
export function parseRolls(command) {
  const input = command || `!roll 2d6 + 1d10 fire + 6d4 force ice + 5 strength + 22 magical ice`;

  const results = {
    rolls: [],
    mods: [],
  };

  const dieRegex = /([+-])?\s?([0-9]+)d([0-9]+)\s?([^+-]*)/g;
  const modRegex = /([+\-!](\S+)?)\s?(?:(?!\d+d\d+)[\w\s])+/g;

  let dieMatches = input.match(dieRegex);
  let modMatches = input.match(modRegex);
  console.log(dieMatches);
  console.log(modMatches);

  for (let i = 0; i < dieMatches.length; i++) {
    dieMatches[i] = dieMatches[i].trim();
  }

  for (let i = 0; i < modMatches.length; i++) {
    modMatches[i] = modMatches[i].trim();
  }
  modMatches = modMatches.filter((match) => match.length > 1 && match[0] !== '!');

  // console.log(dieMatches);
  // console.log(modMatches);

  // add the die rolls to the results
  for (let i = 0; i < dieMatches.length; i++) {
    const match = dieMatches[i].match(/([+-])?\s?([0-9]+)d([0-9]+)\s?([^+-]*)/);
    results.rolls.push(new Roll(match[1], match[2], match[3], match[4].split(' ')));
  }

  // add the modifiers to the results
  for (let i = 0; i < modMatches.length; i++) {
    const match = modMatches[i].match(/([+\-!](\S+)?)\s?(?:(?!\d+d\d+)[\w\s])+/);

    const operation = match[1][0];
    const value = match[0].slice(1).trim().match(/(\d+)/)[0];
    const type = match[0].replace(/[^\w\s]|[\d]/g, '').trim().split(' ');
    // const result = new Modifier(operation, value, type);

    results.mods.push(new Modifier(operation, value, type));
  }

  return results;
}

export function roll(command) {
  const rolls = parseRolls(command);
  const result = new Result();
  // console.log(rolls);

  // roll the dice
  if (rolls.rolls) {
    console.log('--- rolling dice ---');

    for (let i = 0; i < rolls.rolls.length; i++) {
      const rr = rolls.rolls[i];

      // displayRollsGroup(rr);

      for (let dice = 0; dice < rr.quantity; dice++) {
        const nr = new RollResult(rr.operation, rr.die, rr.type);
        console.log(nr.result, nr.die, nr.type);

        result.rolls[`d${rr.die}`].push(nr);
        result.sum += nr.result;
        result.totals.push([nr.result, nr.die, nr.type])
      }
    }
  }

  // apply modifiers
  if (rolls.mods) {
    console.log('--- applying modifiers ---');

    for (let mod = 0; mod < rolls.mods.length; mod++) {
      const mm = rolls.mods[mod];
      // console.log(mm);
      console.log(mm.operation === 'subtract' ? -mm.value : mm.value, mm.type)

      result.mods.push(mm);
      result.sum += mm.value;
      result.totals.push([mm.operation === 'subtract' ? -mm.value : mm.value, mm.type]);
    }
  }

  console.log(result);
  return result;
}

export function displayRollResults() {
  return `--- displaying roll results ---`;
}

const displayRollsGroup = (rr) =>  {
  let rollString = `${rr.operation === 'add' ? '+' : rr.operation === 'subtract' ? '-' : ''} ${rr.quantity}d${rr.die}`;

  if (rr.type.includes(false)) {
    rollString += ' [ untyped ]';
  }
  else {
    rollString += ` ${rr.type[0] !== '' ? `[ ${rr.type.join(', ')} ]` : `[untyped]`}`;
  }

  console.log(rollString);
  console.log(rr);
}