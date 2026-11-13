import type {ReactNode} from "react";
import toast from "react-hot-toast";
import {menuPositionStyle} from "@/components/ui/menuPosition";

// Custom Cut / Copy / Paste menu for text inputs, textareas and contenteditable editors (the Slate chat box),
// replacing the browser menu the app blocks everywhere.

// Input types that hold editable text (checkboxes, buttons, ranges etc. get no menu)
const TEXT_INPUT_TYPES = new Set([``, `text`, `search`, `url`, `tel`, `email`, `password`, `number`]);

// What the menu needs from an editor that keeps its own selection and document (the Slate chat box). The editor
// registers it for its editable element (components/slatejs/util/editMenuAdapter.ts), so this file, and with it the
// app-wide menu, doesn't load the editor library.
export type EditMenuAdapter = {
    // When the menu opens (selection: the DOM selection if it is inside the element): the selected text, whether
    // the editor is read-only, and a function that puts this selection back
    open: (selection: Selection | null) => { text: string; readOnly: boolean; restore: () => void };
    deleteSelection: () => void;        // Cut, when the browser's cut command doesn't run
    insertText: (text: string) => void; // Paste
};

const adapters = new WeakMap<HTMLElement, EditMenuAdapter>();

export function registerEditMenuAdapter(el: HTMLElement, adapter: EditMenuAdapter) {
    adapters.set(el, adapter);
    return () => {
        adapters.delete(el);
    };
}

type Snapshot = {
    el: HTMLElement;
    start: number | null; // inputs / textareas
    end: number | null;
    range: Range | null;  // contenteditable
    editor: { adapter: EditMenuAdapter, restore: () => void } | null; // a registered editor (the Slate chat box)
    text: string;         // selected text when the menu opened
    readOnly: boolean;
    password: boolean;
};

// The editable element the right-click landed in, if any
export function findEditable(target: EventTarget | null): HTMLElement | null {
    if (!(target instanceof Element)) return null;
    const el = target.closest<HTMLElement>(`input, textarea, [contenteditable]:not([contenteditable="false"])`);
    if (!el) return null;
    if (el instanceof HTMLInputElement && !TEXT_INPUT_TYPES.has(el.type)) return null;
    return el;
}

function snapshot(el: HTMLElement): Snapshot {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        let start: number | null = null, end: number | null = null;
        try {
            start = el.selectionStart;
            end = el.selectionEnd;
        } catch {
            // some input types (email, number) don't expose a selection
        }
        return {
            el, start, end, range: null, editor: null,
            text: start !== null && end !== null ? el.value.slice(start, end) : ``,
            readOnly: el.readOnly || el.disabled,
            password: el instanceof HTMLInputElement && el.type === `password`,
        };
    }
    const selection = window.getSelection();
    const inside = !!selection && selection.rangeCount > 0 && el.contains(selection.anchorNode);
    const adapter = adapters.get(el);
    if (adapter) {
        const {text, readOnly, restore} = adapter.open(inside ? selection : null);
        return {el, start: null, end: null, range: null, editor: {adapter, restore}, text, readOnly, password: false};
    }
    const range = inside ? selection!.getRangeAt(0).cloneRange() : null;
    return {el, start: null, end: null, range, editor: null, text: range?.toString() ?? ``, readOnly: false, password: false};
}

// Put focus and the selection back exactly as they were when the menu opened
function restore(s: Snapshot) {
    s.el.focus();
    if (s.start !== null && s.end !== null && `setSelectionRange` in s.el) {
        try {
            (s.el as HTMLInputElement).setSelectionRange(s.start, s.end);
        } catch {
            // type without selection support
        }
    } else if (s.editor) {
        s.editor.restore();
    } else if (s.range) {
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(s.range);
    }
}

async function copy(s: Snapshot) {
    restore(s);
    if (!document.execCommand(`copy`)) await navigator.clipboard.writeText(s.text);
}

// insertText / delete go through the browser's editing pipeline, so React onChange and Undo see them
async function cut(s: Snapshot) {
    restore(s);
    if (document.execCommand(`cut`)) return;
    await navigator.clipboard.writeText(s.text);
    restore(s);
    if (s.editor) s.editor.adapter.deleteSelection();
    else document.execCommand(`delete`);
}

async function paste(s: Snapshot) {
    let text: string;
    try {
        text = await navigator.clipboard.readText();
    } catch {
        toast.error(`Clipboard access was blocked. Use Ctrl+V to paste.`);
        return;
    }
    restore(s);
    if (s.editor) {
        s.editor.adapter.insertText(text);
    } else {
        document.execCommand(`insertText`, false, text);
    }
}

const shortcut = (key: string) =>
    `${typeof navigator !== `undefined` && /Mac|iPhone|iPad/.test(navigator.platform) ? `⌘` : `Ctrl+`}${key}`;

// The menu state for the app's context menu (contextMenuContext): items keep focus in the field when clicked
export function editMenu(el: HTMLElement, x: number, y: number): { clicked: true, style: ReturnType<typeof menuPositionStyle>, options: ReactNode } {
    const s = snapshot(el);
    const hasSelection = s.text.length > 0 && !s.password;
    const canPaste = !s.readOnly && typeof navigator !== `undefined` && !!navigator.clipboard?.readText;

    const item = (key: string, label: string, enabled: boolean, action: (s: Snapshot) => Promise<void>) =>
        <li key={key} className={`btn btn-ghost btn-sm context-menu__edit ${enabled ? `` : `btn-disabled`}`}
            onMouseDown={(e) => e.preventDefault()} // don't move focus out of the field
            onClick={enabled ? () => action(s).catch(() => toast.error(`${label} didn't work here.`)) : undefined}>
            <span>{label}</span>
            <span className="context-menu__shortcut">{shortcut(key)}</span>
        </li>;

    return {
        clicked: true,
        style: menuPositionStyle(x, y),
        options: [
            item(`X`, `Cut`, hasSelection && !s.readOnly, cut),
            item(`C`, `Copy`, hasSelection, copy),
            item(`V`, `Paste`, canPaste, paste),
        ],
    };
}
