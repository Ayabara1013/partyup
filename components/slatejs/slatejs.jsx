import {useMemo} from "react";
import {createEditor} from "slate";
import {Editable, Slate, withReact} from "slate-react";

import {
  editorStyle,
  Element,
  withInlines
} from "@/javascript/slateInput/editorSettings";
import {editorDefault} from "@/javascript/slateInput/defulatValues";

function useCustomEditorHook() {
  const editor = useMemo(() => withInlines(withReact(createEditor())), [])
  return {
    editor
  }
}

function CustomSlate(props) {
  let {editor, initialValue = editorDefault.value.default} = props
  let {readOnly, onKeyDown, onKeyUp, className} = props;
  let editableProps = {
    renderElement: innerProps => <Element {...innerProps}/>,
    className,
    ...readOnly && {readOnly: true},
    ...(!readOnly) && {
      placeholder: "Enter some text...",
      style: editorStyle,
      onKeyDown, onKeyUp
    }
  }
  return (
    <Slate {...{editor, initialValue}}>
      <Editable {...editableProps}/>
    </Slate>
  )
}

export {
  useCustomEditorHook,
  CustomSlate
}