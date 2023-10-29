import { Editable, Slate, withReact } from "slate-react";
import { Element } from "@/app/(game)/play/_ChatWindow/_ChatInput/_slateEditor/_classes/element";
import { createEditor, Range, Transforms } from "slate";
import { isKeyHotkey } from "is-hotkey";
import { withInlines } from "@/app/(game)/play/_ChatWindow/_ChatInput/_slateEditor/_classes/withInlines";
import { useState } from "react";

export default function SlateEditor({}){
  const initialValue = [
    {
      type: 'paragraph',
      children: [ { text: '' } ],
    },
  ];
  const [ editor ] = useState(() => withInlines(withReact(createEditor())))
  const { selection } = editor;

  const onKeyDown = event => {
    console.log(selection.focus.path[0], selection.focus.path[0], selection.focus.offset)

    if (selection && Range.isCollapsed(selection)) {
      const { nativeEvent } = event;
      // calloutKeyDown(event);
      if (isKeyHotkey('left', nativeEvent)) {
        event.preventDefault()
        Transforms.move(editor, { unit: 'offset', reverse: true })
      }
      if (isKeyHotkey('right', nativeEvent)) {
        event.preventDefault()
        Transforms.move(editor, { unit: 'offset' })
      }
    }
  }
  return (
    <Slate editor={editor} initialValue={initialValue} >
      <Editable
        renderElement={props => <Element {...props}/>}
        placeholder="Enter some text..."
        onKeyDown={onKeyDown}
        // onChange={calloutUpdate}
        // onKeyUp={calloutUpdate}
      />
    </Slate>
  )
}