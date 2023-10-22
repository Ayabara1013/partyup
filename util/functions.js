import { ui } from "@/util/ui";
import { dieRegex } from "@/util/constants";

/**
 * Adds a message to the alert overlay.
 * @param {string} message Alert message to display.
 * @param {string?} type If given, will change alert ui color. (info, success, warning, error)
 */
function toastUser(message, type) {
  let alertElement = ui.mainLayout.alert.element();
  let alertMessageElement = ui.mainLayout.alertMessage.element();

  alertElement.classList.remove('hidden');
  let validTypes = [ 'info', 'success', 'warning', 'error' ];

  for (let item of validTypes) {
    alertElement.classList.remove(`alert-${ item }`)
  }

  if (validTypes.includes(type)) {
    alertElement.classList.add(`alert-${ type }`)
  }

  alertMessageElement.innerHTML = message;
  setTimeout(() => {
    alertElement.classList.add('hidden');
    alertMessageElement.innerHTML = '';
  }, 2000)
}

function validateCommand(input) {
    let args = input.trim().split(' ');
    let command = args[0].slice(0,2);

    switch (command){
      case '!r':
        let die = args[1];
        if(dieRegex.test(die)){
          let rollCount = parseInt(die.split('r')[0]);
          let dieSize = parseInt(die.split('r')[1].split('+')[0]);
          let modifier = parseInt(die.split('+')[1]);
          return {
            return: {
              success: true,
              type: 'roll',
              data:{
                rollCount, dieSize, modifier
              }
            },
          }
        }
    }
    return 'test';
}

function sortByKey(array, key) {
  return array.sort(function (a, b) {
    let x = a[key];
    let y = b[key];
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  })
}

function addArrayToArray(array, arrayToAdd, key) {
  for (let newMsg of arrayToAdd) {
    let index = array.indexOf(array.find(msg => msg[key] === newMsg[key]));
    if (index === -1) {
      array.push( newMsg);
    } else {
      array[index] = newMsg;
    }
  }
}

export {
  toastUser,
  sortByKey,
  addArrayToArray,
  validateCommand
};