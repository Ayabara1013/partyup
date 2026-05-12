import {Ref} from "react";

const safetyChecksArray = [{
    title: `Queer`,
    value: `q`,
}, {
    title: `SA`,
    value: `sa`
}, {
    title: `Trigger Warnings`,
    value: `tw`
}, {
    title: `RYG Light`,
    value: `rygl`
},]
export const safetyChecks = {
    array: safetyChecksArray,
    checkListArray: (refList: Array<Ref<any>>) => {
        return [
            {
                ref: refList[0],
                checked: false,
                label: safetyChecksArray[0].title,
                value: safetyChecksArray[0].value,
                dbValue: `sc0`
            },
            {
                ref: refList[1],
                checked: false,
                label: safetyChecksArray[1].title,
                value: safetyChecksArray[1].value,
                dbValue: `sc1`
            },
            {
                ref: refList[2],
                checked: false,
                label: safetyChecksArray[2].title,
                value: safetyChecksArray[2].value,
                dbValue: `sc2`
            },
            {
                ref: refList[3],
                checked: false,
                label: safetyChecksArray[3].title,
                value: safetyChecksArray[3].value,
                dbValue: `sc3`
            },
        ]
    },
    valueToTitle: {
        [safetyChecksArray[0].value]: safetyChecksArray[0].title,
        [safetyChecksArray[1].value]: safetyChecksArray[1].title,
        [safetyChecksArray[2].value]: safetyChecksArray[2].title,
        [safetyChecksArray[3].value]: safetyChecksArray[3].title,
    }
}