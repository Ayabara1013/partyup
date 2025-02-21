// rolling

import { arrayReduce } from '@/util/functions';

/**
 * const rollDie = (count = 1, die = 6) => {
	let value = [];
	for (let roll = 0; roll < count; roll++) {
		result = [Math.floor(Math.random() * die) + 1, die]
		value.push(result)

		console.log(result)
	}

	return value;
}
*/

const rollDie = (die = 6) => {
	let result = [Math.floor(Math.random() * die) + 1, die];
	console.log(result);
	return result;
}
// if this is for doing a single die, maybe ill just boil it down to this



// constructor([1,4,0,0,2,5,6]) ~~~
// returns 1d4 4d6 2d12 5d20 6d100
// or am I overthinking?

const roll = (dice = [[0, 4], [1, 6], [0, 8], [0, 10], [0, 12], [0, 20], [0, 100]]) => {
	let tally = [0];  // index 0 will always be reserved for the total count
	console.log(`dice array: `, dice)
	
	for (let die = 0; die < dice.length; die++) {
		console.log(`rolling ${dice[die][0]}d${dice[die][1]}`)
		
		let string = `(d${dice[die][1]}) `
		// now roll each of the die for that type
		for (let count = 0; count < dice[die][0]; count++) {
			let result = rollDie(dice[die][1]);
		}
	}

  return tally;
}


// optional way of doing something like roll(1,2,3,4,5,6,7) ? 
const rollv2 = (d4 = 0, d6 = 0, d8 = 0, d10 = 0, d12 = 0, d20 = 0, d100 = 0) => {
  // let tally = [0]; // Total count will be at index 0
  // const dice = [
  //   {count: d4, sides: 4},
  //   {count: d6, sides: 6},
  //   {count: d8, sides: 8},
  //   {count: d10, sides: 10},
  //   {count: d12, sides: 12},
  //   {count: d20, sides: 20},
  //   {count: d100, sides: 100},
  // ];

  // // Loop through dice array
  // for (let {count, sides} of dice) {
  //   for (let i = 0; i < count; i++) {
  //     let result = rollDie(1, sides);
  //     tally.push([result, sides]); // Record the result of this roll
  //     tally[0] += result; // Add result to total
  //   }
  // }

	// return tally;
	
	// for (let {count, sides} of dice) {
	// 	console.log(`Rolling ${count}d${sides}`);
	// }

	let tally = [[0, 0]]; 
	let total = tally[0][0];
	let runningString = '';

	const dice = [
		{count: d4, sides: 4},
    {count: d6, sides: 6},
    {count: d8, sides: 8},
    {count: d10, sides: 10},
    {count: d12, sides: 12},
    {count: d20, sides: 20},
    {count: d100, sides: 100},
	]

	for (let { count, sides } of dice) {
		for (let i = 0; i < count; i++) {
			let result = rollDie(sides);
			tally.push(result)
			total += result[0];
			runningString += `${result[0]}, `
		}
	}

	if (runningString.endsWith(', ')) {
		runningString = runningString.slice(0, -2);
	}

	console.log(runningString, tally);
	
	return tally;
}


// abilities
const abilityCheck = () => {
	// rolldie
}


const rollFate = (count) => {
	let tally = [0];
	let arr = [];
	console.clear();

	for (let die = 0; die < count; die++) {
		// let result = rollDie() / 2;
		// if (result == 1) return -1;
		// else if (result == 2) return 0;
		// else if (result == 3) return 1;
		// let result = rollDie(6)[0] / 2 - 2;
		// let result = rollDie(6)[0];
		// // console.log(result);

		// result = Math.ceil(result / 2);
		// // console.log(result);

		// result -= 2;
		// console.log(result);
		let result = rollDie(6);
		// let result = Math.ceil(rollDie(6)[0] / 2) -2
		arr.push(result[0]);
		
		result = Math.ceil(result[0] / 2) - 2;
		
		tally.push(result);
		tally[0] += result;
	}

	console.log(arr);
	console.log(tally.slice(1));

	console.log(`test`)
	for (let a = 0; a < count; a++) {
		console.log(`test ${a}`)
		if (arr[a] == 1 || arr[a] == 2) {
			if (tally[a + 1] !== -1) { console.log(`array is wrong at spot ${a}!`) } 
			else console.log(`clear! ${arr[a]} == ${tally[a+1]}`)
		}
		else if (arr[a] == 3 || arr[a] == 4) {
			if (tally[a + 1] !== 0) { console.log(`array is wrong at spot ${a}!`) }
			else console.log(`clear! ${arr[a]} == ${tally[a+1]}`)
		}
		else if (arr[a] == 5 || arr[a] == 6) {
			if (tally[a + 1] !== 1) { console.log(`array is wrong at spot ${a}!`) }
			else console.log(`clear! ${arr[a]} == ${tally[a+1]}`)
		}
		
	}
	
	return tally;

	// console.log(tally);
}

// console.log(rollFate(6))


export {
	rollv2, rollFate, rollDie, roll
}