import {ui} from "@/util/ui";

/**
 * Adds a message to the alert overlay.
 * @param {string} message Alert message to display.
 * @param {string?} type If given, will change alert ui color. (info, success, warning, error)
 */
function alertUser (message, type){
    let alertElement = ui.mainLayout.alert.element();
    let alertMessageElement = ui.mainLayout.alertMessage.element();
    alertElement.classList.remove('hidden');
    let validTypes = ['info', 'success', 'warning', 'error'];

    console.log(validTypes.includes(type))

    if(validTypes.includes(type)){
        alertElement.classList.add(`alert-${type}`)
    }

    alertMessageElement.innerHTML = message;
    setTimeout(()=>{
        alertElement.classList.add('hidden');
        alertMessageElement.innerHTML = '';
        for(let item of validTypes){
            alertElement.classList.remove(`alert-${item}`)
        }
    }, 2000)
}

export {
    alertUser
};