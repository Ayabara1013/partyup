import type {FormEvent, ReactNode} from "react";
import {useState} from "react";
import toast from "react-hot-toast";
import {useContextMenuSetter} from "@/app/(context)/contextMenuContext";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import {capitalize} from "@/lib/util/strings";

// The parts of a dice result's log this menu reads (the shape is in diceLog.ts)
type RollLog = { groups?: { label?: string }[], adjustments?: unknown[] } | null;

type RollMenuProps = {
    items: ReactNode;
    messageId: string;
    log: RollLog;
};

// The GM's menu on a dice result (chatMessage.tsx): the message's usual items, then "Modify roll", which turns the
// same menu into further steps. Every step is marked data-menu-keep-open, so its clicks leave the menu open
// (contextMenuContext.tsx); the usual items still close it on one click. "Add circumstance" asks which part (when
// the result has several), then for a number and a note; applying it, or "Reset roll", closes the menu when the
// database has saved it, and a refusal keeps it open. "Other" does nothing yet.
export default function RollMenu({items, messageId, log}: RollMenuProps) {
    const setContextMenu = useContextMenuSetter();
    const [step, setStep] = useState<`first` | `modify` | `part` | `form`>(`first`);
    const [part, setPart] = useState(0);
    const [value, setValue] = useState(``);
    const [note, setNote] = useState(``);
    const [saving, setSaving] = useState(false);

    // Each part by its type, as the totals line names it ("Fire", "Untyped")
    const parts = (log?.groups ?? []).map((g) => capitalize(g.label || `untyped`));
    const adjusted = (log?.adjustments?.length ?? 0) > 0;
    const close = () => setContextMenu({clicked: false});

    const addCircumstance = () => {
        if (parts.length > 1) {
            setStep(`part`);
        } else {
            setPart(0);
            setStep(`form`);
        }
    };

    // The database checks the range, 0 and the note's length; a value that is not a whole number of at most three
    // digits stops here (a longer one would fail the database's integer cast with a technical message)
    const apply = async (e: FormEvent) => {
        e.preventDefault();
        if (saving) return;
        const text = value.trim();
        if (!/^[+-]?\d{1,3}$/.test(text)) {
            toast.error(`Enter a whole number from -100 to 100, not 0.`);
            return;
        }
        setSaving(true);
        const ok = await supabaseInGame.edit.roll.adjust(messageId, Number(text), note.trim() || null, part);
        setSaving(false);
        if (ok) close();
    };

    const reset = async () => {
        if (saving) return;
        setSaving(true);
        const ok = await supabaseInGame.edit.roll.reset(messageId);
        setSaving(false);
        if (ok) close();
    };

    const back = (to: typeof step) =>
        <li className="btn btn-ghost btn-sm context-menu__back" data-menu-keep-open onClick={() => setStep(to)}>
            <ChevronLeftIcon/>
            Back
        </li>;

    if (step === `first`) {
        return <>
            {items}
            <li className="btn btn-ghost btn-sm" data-menu-keep-open onClick={() => setStep(`modify`)}>Modify roll</li>
        </>;
    }

    if (step === `part`) {
        return <>
            {back(`modify`)}
            <li className="context-menu__heading" data-menu-keep-open>Which part?</li>
            {parts.map((label, i) =>
                <li key={i} className="btn btn-ghost btn-sm" data-menu-keep-open onClick={() => {
                    setPart(i);
                    setStep(`form`);
                }}>{label}</li>)}
        </>;
    }

    if (step === `form`) {
        return <>
            {back(parts.length > 1 ? `part` : `modify`)}
            <li className="context-menu__form" data-menu-keep-open>
                <form onSubmit={apply}>
                    <label className="field">
                        <span className="field__label">Circumstance{parts.length > 1 ? ` (${parts[part]})` : ``}</span>
                        <input className="field__input" type="text" inputMode="numeric" placeholder="+2 or -1"
                               value={value} onChange={(e) => setValue(e.target.value)} autoFocus/>
                    </label>
                    <label className="field">
                        <span className="field__label">Note <span className="field__optional">optional</span></span>
                        <input className="field__input" type="text" maxLength={40} placeholder="cover"
                               value={note} onChange={(e) => setNote(e.target.value)}/>
                    </label>
                    <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                        {saving ? <span className="loading loading-spinner loading-xs"/> : `Apply`}
                    </button>
                </form>
            </li>
        </>;
    }

    return <>
        {back(`first`)}
        <li className="btn btn-ghost btn-sm" data-menu-keep-open onClick={addCircumstance}>Add circumstance</li>
        {adjusted && <li className="btn btn-ghost btn-sm" data-menu-keep-open onClick={reset}>Reset roll</li>}
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
