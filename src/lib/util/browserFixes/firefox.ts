import React from "react";

export const firefoxNumberInputOnKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
) => {
    const allowedKeys = [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "Tab",
        "Home",
        "End",
    ];

    const isNumber = /^[0-9]$/.test(e.key);

    if (!isNumber && !allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
};