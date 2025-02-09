// rolling

const rollDie = (count = 1, die = 6) => {
    let value = [];

    for (let roll = 0; roll < count; roll++) {
        result = [Math.floor(Math.random() * die) + 1, die]
        value.push(result)

        console.log(result)
    }

    return value;
}

// abilities
