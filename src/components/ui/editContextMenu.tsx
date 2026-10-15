import type {CSSProperties, ReactNode} from "react";
import toast from "react-hot-toast";
import {Editor, Range as SlateRange, Transforms} from "slate";
import {ReactEditor} from "slate-react";

// Custom Cut / Copy / Paste menu for text inputs, textareas and contenteditable editors (the Slate chat box),
// replacing the browser menu the app blocks everywhere.

// Input types that hold editable text (checkboxes, buttons, ranges etc. get no menu)
const TEXT_INPUT_TYPES = new Set([``, `text`, `search`, `url`, `tel`, `email`, `password`, `number`]);

const MENU_WIDTH = 200;

// Slate editors by their editable element. Slate keeps its own selection and document, so DOM editing commands
// don't reach it reliably: its menu items go through the editor instead (see useEditMenuEditor in slatejs.tsx).
const slateEditors = new WeakMap<HTMLElement, ReactEditor>();

export function registerSlateEditor(editor: ReactEditor) {
    const el = ReactEditor.toDOMNode(editor, editor);
    slateEditors.set(el, editor);
    return () => {
        slateEditors.delete(el);
    };
}

type Snapshot = {
    el: HTMLElement;
    start: number | null; // inputs / textareas
    end: number | null;
    range: Range | null;  // contenteditable
    slate: { editor: ReactEditor, range: SlateRange | null } | null;
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
            el, start, end, range: null, slate: null,
            text: start !== null && end !== null ? el.value.slice(start, end) : ``,
            readOnly: el.readOnly || el.disabled,
            password: el instanceof HTMLInputElement && el.type === `password`,
        };
    }
    const selection = window.getSelection();
    const inside = !!selection && selection.rangeCount > 0 && el.contains(selection.anchorNode);
    const editor = slateEditors.get(el);
    if (editor) {
        // A right-click collapses the DOM selection to a caret before this runs, while Slate still holds the
        // selection that was there. Keep Slate's when the caret landed inside it; otherwise the caret is where the
        // user clicked (Slate hasn't synced it yet).
        const dom = inside ? ReactEditor.toSlateRange(editor, selection!, {exactMatch: false, suppressThrow: true}) : null;
        const held = editor.selection;
        const range = dom && SlateRange.isCollapsed(dom) && held && SlateRange.isExpanded(held) && SlateRange.includes(held, dom.anchor)
            ? held : dom ?? held;
        return {
            el, start: null, end: null, range: null, slate: {editor, range},
            text: range && SlateRange.isExpanded(range) ? Editor.string(editor, range) : ``,
            readOnly: ReactEditor.isReadOnly(editor), password: false,
        };
    }
    const range = inside ? selection!.getRangeAt(0).cloneRange() : null;
    return {el, start: null, end: null, range, slate: null, text: range?.toString() ?? ``, readOnly: false, password: false};
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
    } else if (s.slate) {
        // Slate's selection drives its copy / cut handlers; the DOM selection decides which element gets the event
        const {editor, range} = s.slate;
        if (!range) return;
        Transforms.select(editor, range);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(ReactEditor.toDOMRange(editor, range));
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
    if (s.slate) Editor.deleteFragment(s.slate.editor);
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
    if (s.slate) {
        // Same path as Ctrl+V: multi-line text becomes separate lines
        const data = new DataTransfer();
        data.setData(`text/plain`, text);
        ReactEditor.insertData(s.slate.editor, data);
    } else {
        document.execCommand(`insertText`, false, text);
    }
}

const shortcut = (key: string) =>
    `${typeof navigator !== `undefined` && /Mac|iPhone|iPad/.test(navigator.platform) ? `⌘` : `Ctrl+`}${key}`;

// The menu state for the app's context menu (contextMenuContext): items keep focus in the field when clicked
export function editMenu(el: HTMLElement, x: number, y: number): { clicked: true, style: CSSProperties, options: ReactNode } {
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

    const openLeft = x + MENU_WIDTH > window.innerWidth;
    return {
        clicked: true,
        style: {top: `${y}px`, ...(openLeft ? {right: `${window.innerWidth - x}px`} : {left: `${x}px`})},
        options: [
            item(`X`, `Cut`, hasSelection && !s.readOnly, cut),
            item(`C`, `Copy`, hasSelection, copy),
            item(`V`, `Paste`, canPaste, paste),
        ],
    };
}
