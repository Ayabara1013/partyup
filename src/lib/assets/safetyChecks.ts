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
}

// Safety tool columns on `game`, in the same order as safetyChecks.array
export const SAFETY_COLUMNS = [`sc0`, `sc1`, `sc2`, `sc3`] as const;