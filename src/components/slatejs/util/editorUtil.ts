import {Descendant, Editor, Element as SlateElement, Node, Path, Point, Range, Text, Transforms} from "slate";
import type {KeyboardEvent} from "react";
import {editorDefault} from "@/components/slatejs/util/editorDefaultValues";

type BadgeElement = {
    type: "badge";
    value: string;
    children: Descendant[];
};

const isBadgeElement = (node: Node): node is BadgeElement => {
    return SlateElement.isElement(node) && node.type === "badge";
};

// The text node holding a collapsed cursor, with the cursor's offset in it
function focusedText(editor: Editor): { text: string, path: Path, offset: number } | undefined {
    const {selection} = editor;
    if (!selection) return undefined;

    const {path, offset} = selection.focus;
    const node = Node.get(editor, path);
    return Text.isText(node) ? {text: node.text, path, offset} : undefined;
}

// Bounds of the space-separated word around `offset` (a cursor right after a word belongs to it).
// Scans out from the cursor instead of splitting the whole line on every keystroke.
function wordAt(text: string, offset: number) {
    const start = offset === 0 ? 0 : text.lastIndexOf(" ", offset - 1) + 1;
    const space = text.indexOf(" ", offset);
    return {start, end: space === -1 ? text.length : space};
}

const editorFix = {
    // Badges are read-only inline elements; if the cursor lands inside one, move it just past it
    keyUp: (_e: KeyboardEvent<HTMLDivElement> | undefined, editor: Editor) => {
        const badge = editor.selection && Editor.above(editor, {match: isBadgeElement});
        if (!badge) return;

        const nextPath = Path.next(badge[1]);
        if (Node.has(editor, nextPath)) Transforms.select(editor, Editor.start(editor, nextPath));
    },
};

const editorTools = {
    offset: {
        // End of `fragment` in the word at the cursor (falls back to the nearest earlier match)
        findFocus: (editor: Editor, fragment: string): Point | undefined => {
            const focused = focusedText(editor);
            if (!focused) return undefined;

            const {text, path, offset} = focused;
            const {end} = wordAt(text, offset);
            if (text.slice(end - fragment.length, end) === fragment) return {path, offset: end};

            const index = text.lastIndexOf(fragment, offset);
            return index === -1 ? undefined : {path, offset: index + fragment.length};
        },

        // The word the cursor is in, e.g. "@an" while typing a mention
        focusedFragment: (editor: Editor): string | undefined => {
            const focused = focusedText(editor);
            if (!focused) return undefined;

            const {start, end} = wordAt(focused.text, focused.offset);
            return focused.text.slice(start, end);
        },
    },

    // Backspace right after a badge (e.g. a mention pill) removes the whole badge
    removeBadgeBeforeCursor: (editor: Editor): boolean => {
        const {selection} = editor;
        if (!selection || !Range.isCollapsed(selection)) return false;

        const {path, offset} = selection.focus;
        const index = path[path.length - 1];
        if (offset !== 0 || index === 0) return false;

        const prevPath = [...path.slice(0, -1), index - 1];
        if (!Node.has(editor, prevPath) || !isBadgeElement(Node.get(editor, prevPath))) return false;

        Transforms.removeNodes(editor, {at: prevPath});
        return true;
    },

    resetEditor: (editor: Editor) => {
        Editor.withoutNormalizing(editor, () => {
            // Remove every top-level block in one pass, then add a fresh empty paragraph
            Transforms.removeNodes(editor, {at: [], match: (_node, path) => path.length === 1});
            Transforms.insertNodes(editor, structuredClone(editorDefault.value.default), {at: [0]});
            Transforms.select(editor, editorDefault.selection.default);
        });
    },

    // Plain text to send: badges become their stored value (mentions -> <@userId>), blocks become lines
    getEditorStringValue: (editor: Editor): string => {
        const toString = (node: Node): string => {
            if (Text.isText(node)) return node.text;
            if (isBadgeElement(node)) return node.value;
            if (SlateElement.isElement(node)) {
                let out = ``;
                for (const child of node.children) out += toString(child);
                return out;
            }
            return ``;
        };

        return editor.children.map(toString).join("\n");
    },
};

export {editorFix, editorTools};
