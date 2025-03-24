const msgArrayManip = {
  sortByCreated: function (array) {
    array.sort(function (a, b) {
      let x = a.createdAt.seconds;
      let y = b.createdAt.seconds;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    })
  },
  sortByUpdated: function (array) {
    array.sort(function (a, b) {
      let x = a.updatedAt.seconds;
      let y = b.updatedAt.seconds;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    })
  },
  sortByKey: function (array, key) {
    array.sort(function (a, b) {
      let x = a[key];
      let y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    })
  },
  combineReplaceOnKey: function (array, arrayToAdd, key) {
    for (let newMsg of arrayToAdd) {
      let index = array.indexOf(array.find(msg => msg[key] === newMsg[key]));
      if (index === -1) {
        array.push(newMsg);
      } else {
        array[index] = newMsg;
      }
    }
  }

}
export default msgArrayManip