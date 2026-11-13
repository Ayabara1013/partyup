import {Descendant} from "slate";

const editorDefault = {
    selection: {
        default: {
            anchor: {path: [0, 0], offset: 0},
            focus: {path: [0, 0], offset: 0}
        },
    },

    value: {
        default: [
            {
                type: "paragraph",
                children: [{ text: "" }],
            },
        ] satisfies Descendant[],
    },
}
export {
    editorDefault
}