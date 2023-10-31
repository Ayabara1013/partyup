import { useMemo } from "react";
import { createEditor } from "slate";
import { Editable, Slate, withReact } from "slate-react";

import {
  editorStyle,
  Element,
  withInlines
} from "@/components/slatejs/(util)/editorSettings";
import { editorDefault } from "@/components/slatejs/(util)/defulatValues";

function useCustomEditorHook() {
  const editor = useMemo(() => withInlines(withReact(createEditor())), [])
  return {
    editor
  }
}

function CustomSlate(props) {
  let { editor, initialValue = editorDefault.value.default } = props
  let { readOnly, onKeyDown, onKeyUp } = props;
  let editableProps = {
    renderElement: innerProps => <Element {...innerProps}/>,
    ...readOnly && { readOnly: true },
    ...(!readOnly) && {
      placeholder: "Enter some text...",
      onKeyDown: onKeyDown,
      onKeyUp: onKeyUp,
      style: editorStyle,
    }
  }
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable {...editableProps}/>
    </Slate>
  )
}

export {
  useCustomEditorHook,
  CustomSlate
}