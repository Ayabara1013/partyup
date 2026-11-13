import {Editor, Range as SlateRange, Transforms} from "slate";
import {ReactEditor} from "slate-react";
import {registerEditMenuAdapter} from "@/components/ui/editContextMenu";

// Connects a Slate editor to the app's Cut / Copy / Paste menu (components/ui/editContextMenu.tsx). Slate keeps its
// own selection and document, so DOM editing commands don't reach it reliably: its menu items go through the editor
// instead (registerSlateEditor, called from slatejs.tsx). Kept with the editor so the menu doesn't load Slate on
// every page. Returns the unregister function.
export function registerSlateEditor(editor: ReactEditor) {
    return registerEditMenuAdapter(ReactEditor.toDOMNode(editor, editor), {
        open: (selection) => {
            // A right-click collapses the DOM selection to a caret before this runs, while Slate still holds the
            // selection that was there. Keep Slate's when the caret landed inside it; otherwise the caret is where the
            // user clicked (Slate hasn't synced it yet).
            const dom = selection ? ReactEditor.toSlateRange(editor, selection, {exactMatch: false, suppressThrow: true}) : null;
            const held = editor.selection;
            const range = dom && SlateRange.isCollapsed(dom) && held && SlateRange.isExpanded(held) && SlateRange.includes(held, dom.anchor)
                ? held : dom ?? held;
            return {
                text: range && SlateRange.isExpanded(range) ? Editor.string(editor, range) : ``,
                readOnly: ReactEditor.isReadOnly(editor),
                // Slate's selection drives its copy / cut handlers; the DOM selection decides which element gets the event
                restore: () => {
                    if (!range) return;
                    Transforms.select(editor, range);
                    const domSelection = window.getSelection();
                    domSelection?.removeAllRanges();
                    domSelection?.addRange(ReactEditor.toDOMRange(editor, range));
                },
            };
        },
        deleteSelection: () => Editor.deleteFragment(editor),
        // Same path as Ctrl+V: multi-line text becomes separate lines
        insertText: (text) => {
            const data = new DataTransfer();
            data.setData(`text/plain`, text);
            ReactEditor.insertData(editor, data);
        },
    });
}
