import {Descendant, Editor, Element as SlateElement, Node, Point, Range, Text, Transforms} from "slate";
import {isKeyHotkey} from "is-hotkey";
import type {KeyboardEvent} from "react";
import {editorDefault} from "@/components/slatejs/util/editorDefaultValues";

type BadgeElement = {
    type: "badge";
    value: string;
    children: Descendant[];
};

type CustomElement = SlateElement & {
    type?: string;
    value?: string;
    children: Descendant[];
};

const isCustomElement = (node: Node): node is CustomElement => {
    return SlateElement.isElement(node);
};

const isBadgeElement = (node: Node): node is BadgeElement => {
    return SlateElement.isElement(node) && node.type === "badge";
};

const editorFix = {
    keyDown: (e: KeyboardEvent<HTMLDivElement>, editor: Editor) => {
        const {selection} = editor;

        if (selection && Range.isCollapsed(selection)) {
            const {nativeEvent} = e;

            if (isKeyHotkey("left", nativeEvent)) {
                e.preventDefault();
                Transforms.move(editor, {unit: "offset", reverse: true});
            }

            if (isKeyHotkey("right", nativeEvent)) {
                e.preventDefault();
                Transforms.move(editor, {unit: "offset"});
            }

            if (isKeyHotkey("tab", nativeEvent)) {
                e.preventDefault();
            }
        }
    },

    keyUp: (_e: KeyboardEvent<HTMLDivElement> | undefined, editor: Editor) => {
        if (!editor.selection) return;

        const {path} = editor.selection.focus;
        const newPathOffset: Point = {
            path: [path[0], path[1] + 1],
            offset: 0,
        };

        const focusedChild = editorTools.offset.focusedChild(editor);

        if (focusedChild && isBadgeElement(focusedChild)) {
            Transforms.setSelection(editor, {
                anchor: newPathOffset,
                focus: newPathOffset,
            });
        }
    },
};

const editorTools = {
    offset: {
        findFocus: (editor: Editor, fragment: string): Point | undefined => {
            if (!editor.selection) return undefined;

            const {path} = editor.selection.focus;
            const focusedChild = Node.get(editor, path);

            if (!Text.isText(focusedChild)) return undefined;

            const offset = focusedChild.text.indexOf(fragment) + fragment.length;

            return {path, offset};
        },

        focusedChild: (editor: Editor): Node | undefined => {
            if (!editor.selection) return undefined;

            return Node.get(editor, editor.selection.focus.path);
        },

        focusedFragment: (editor: Editor): string | undefined => {
            if (!editor.selection) return undefined;

            const {path, offset} = editor.selection.focus;
            const focusedChild = Node.get(editor, path);

            if (!Text.isText(focusedChild)) return undefined;

            const words = focusedChild.text.split(" ");
            let wordIndex = 0;
            let characterCount = 0;

            while (characterCount <= offset && wordIndex < words.length) {
                characterCount += words[wordIndex].length + 1;
                wordIndex++;
            }

            return words[Math.max(wordIndex - 1, 0)];
        },
    },

    resetEditor: (editor: Editor) => {
        const defaultValue = structuredClone(editorDefault.value.default);

        Editor.withoutNormalizing(editor, () => {
            // Remove all top-level nodes
            for (let i = editor.children.length - 1; i >= 0; i--) {
                Transforms.removeNodes(editor, {at: [i]});
            }

            // Insert fresh default paragraph
            Transforms.insertNodes(editor, defaultValue, {at: [0]});

            // Reset cursor
            Transforms.select(editor, editorDefault.selection.default);
        });
    },

    getEditorStringValue: (editor: Editor): string => {
        const recurseThroughChildren = (child: Node): string => {
            if (isBadgeElement(child)) {
                return child.value;
            }

            if (isCustomElement(child)) {
                return child.children.map(recurseThroughChildren).join("");
            }

            if (Text.isText(child)) {
                return child.text;
            }

            return "";
        };

        return editor.children.map(recurseThroughChildren).join("\n");
    },

    // toEditorFormat: markdownParser.toEditor,

    compareValues: (array1: Descendant[], array2: Descendant[]): boolean => {
        return JSON.stringify(array1) === JSON.stringify(array2);
    },
};

export {editorFix, editorTools};