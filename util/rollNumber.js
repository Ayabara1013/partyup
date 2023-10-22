export default
const rollNumber = {
  dice: (die, player, rollCount) => {
    let rolls = [];
    for (let i = 0; i < rollCount; i++) {
      rolls.push(Math.floor(Math.random() * die) + 1);
    }
    let rollString = `d${ die } * ${ rollCount } = ${ rolls.map(roll => `${ roll }, `) }`.slice(-1);

    return {rolls, rollString};

  },
  stat: (stat, player, rollCount) => {
    let rolls = [];
    for (let i = 0; i < rollCount; i++) {
      rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    let rollString = `d6 * ${ rollCount } = ${ rolls.map(roll => `${ roll }, `) }`.slice(-1);

    return {rolls, rollString};
  }
}