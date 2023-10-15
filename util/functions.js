import { ui } from "@/util/ui";

/**
 * Adds a message to the alert overlay.
 * @param {string} message Alert message to display.
 * @param {string?} type If given, will change alert ui color. (info, success, warning, error)
 */
function toastUser (message, type){
    let alertElement = ui.mainLayout.alert.element();
    let alertMessageElement = ui.mainLayout.alertMessage.element();

    alertElement.classList.remove('hidden');
    let validTypes = ['info', 'success', 'warning', 'error'];

    for(let item of validTypes){
        alertElement.classList.remove(`alert-${item}`)
    }

    if(validTypes.includes(type)){
        alertElement.classList.add(`alert-${type}`)
        console.log(`alert-${type}`)
    }

    alertMessageElement.innerHTML = message;
    setTimeout(()=>{
        alertElement.classList.add('hidden');
        alertMessageElement.innerHTML = '';
    }, 2000)
}

/**
 * Disables the context menu on the given element.
 * @param {object} e Target element to disable context menu on.
 */
function preventContextMenu(e){
    e.preventDefault();
}

function sortByKey(array, key){
    return array.sort(function(a, b) {
        let x = a[key]; let y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    })
}

function addArraytoArray(array, arrayToAdd, key){
    for(let newMsg of arrayToAdd){
        let index = array.indexOf(array.find(msg => msg[key] === newMsg[key]));
        if(index === -1){
            array.push(newMsg);
        } else {
            console.log('update:' ,array[index], newMsg)
            array[index] = newMsg;
        }
    }
}

export {
    toastUser,
    preventContextMenu,
    sortByKey,
    addArraytoArray
};