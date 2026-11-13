import type {CSSProperties} from "react";

// Approximate menu width, to open it leftwards near the right edge of the window
export const MENU_WIDTH = 200;

// The style for a context menu anchored at (x, y): opens leftwards when it would run off the right edge
export function menuPositionStyle(x: number, y: number, width: number = MENU_WIDTH): CSSProperties {
    const openLeft = x + width > window.innerWidth;
    return {
        top: `${y}px`,
        ...(openLeft ? {right: `${window.innerWidth - x}px`} : {left: `${x}px`}),
    };
}
