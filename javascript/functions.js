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

export {
  sortByKey,
  addArrayToArray
};