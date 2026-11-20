import type {ReactNode} from "react";
import {useState} from "react";

// The GM's menu on a dice result (chatMessage.tsx): the message's usual items, then "Modify roll", which turns the
// same menu into a second step. "Modify roll" and the step are marked data-menu-keep-open, so their clicks leave the
// menu open (contextMenuContext.tsx); the usual items still close it on one click. Task 18 makes "Add circumstance"
// work and closes the menu (useContextMenuSetter) when it finishes; until then neither entry does anything.
export default function RollMenu({items}: { items: ReactNode }) {
    const [step, setStep] = useState<`first` | `modify`>(`first`);

    if (step === `first`) {
        return <>
            {items}
            <li className="btn btn-ghost btn-sm" data-menu-keep-open onClick={() => setStep(`modify`)}>Modify roll</li>
        </>;
    }
    return <>
        <li className="btn btn-ghost btn-sm context-menu__back" data-menu-keep-open onClick={() => setStep(`first`)}>
            <ChevronLeftIcon/>
            Back
        </li>
        <li className="btn btn-ghost btn-sm" data-menu-keep-open>Add circumstance</li>
        <li className="btn btn-ghost btn-sm" data-menu-keep-open>Other</li>
    </>;
}

// Lucide "chevron-left" icon (ISC license)
function ChevronLeftIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6"/>
        </svg>
    );
}
