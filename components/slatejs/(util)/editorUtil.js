import { Range, Transforms } from "slate";
import { isKeyHotkey } from "is-hotkey";
import { ReactEditor } from "slate-react";
import { editorDefault as editorSettings } from "@/components/slatejs/(util)/defulatValues";

const editorFix = {
  keyDown: (e, editor) => {
    let { selection } = editor;
    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = e;
      // calloutKeyDown(event);
      if (isKeyHotkey('left', nativeEvent)) {
        e.preventDefault()
        Transforms.move(editor, { unit: 'offset', reverse: true })
      }
      if (isKeyHotkey('right', nativeEvent)) {
        e.preventDefault()
        Transforms.move(editor, { unit: 'offset' })
      }
      if (isKeyHotkey('tab', nativeEvent)) {
        e.preventDefault()
      }
    }
  },
  keyUp: (e, editor) => {
    let { path } = editor.selection.focus;
    let newPathOffset = {
      path: [ path[0], path[1] + 1 ],
      offset: 0
    };
    if (editorTools.offset.focusedChild(editor).type === 'badge') {
      Transforms.setSelection(editor, { anchor: newPathOffset, focus: newPathOffset });
    }
  }
}

const editorTools = {
  offset: {
    findFocus: (editor, fragment) => {
      let { path } = editor.selection.focus;
      let focusedChild = editor.children[path[0]].children[path[1]];
      let offset = focusedChild.text.indexOf(fragment) + fragment.length;
      return { path, offset };
    },
    focusedChild: (editor) => {
      let { path } = editor.selection.focus;
      return editor.children[path[0]].children[path[1]];
    },
    focusedFragment: (editor) => {
      let { path, offset } = editor.selection.focus;
      let focusedChild = editor.children[path[0]].children[path[1]];
      if (!focusedChild.type) {
        let words = focusedChild.text.split(' ');
        let wordIndex = 0;
        let characterCount = 0;
        while (characterCount <= offset) {
          characterCount += words[wordIndex].length + 1;
          wordIndex++;
        }
        if (wordIndex < 0) {
          wordIndex = 0;
        }
        return words[wordIndex - 1]
      }
      return undefined;
    },
  },
  resetEditor: (editor) => {
    editor.children = editorSettings.value.default;
    Transforms.select(editor, editorSettings.selection.default);
  },
  printValues: (messageObject) => {
    let text = '';
    for (let child of messageObject) {
      if (child.children) {
        for (let grandchild of child.children) {
          text += (grandchild.type === 'badge') ? grandchild.value : `${grandchild.text}`;
        }
      }
      text += '\n';
    }
    text.slice(0, -1)
    return text;
  }
}

export {
  editorFix,
  editorTools
}