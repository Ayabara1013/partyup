import {useMemo} from "react";
import {createEditor} from "slate";
import {Editable, Slate, withReact} from "slate-react";

import {
  editorStyle,
} from "@/javascript/slateInput/editorSettings";
import {editorDefault} from "@/javascript/slateInput/defulatValues";
import ElementRenderer from "@components/slatejs/elementRenderer";

function useCustomEditorHook() {
  const withInlines = editor => {
    const {isInline, isElementReadOnly, isSelectable} = editor

    editor.isInline = element =>
      ['link', 'button', 'badge'].includes(element.type) || isInline(element)

    editor.isElementReadOnly = element =>
      element.type === 'badge' || isElementReadOnly(element)

    editor.isSelectable = element =>
      element.type !== 'badge' && isSelectable(element)

    return editor
  }
  const editor = useMemo(() => withInlines(withReact(createEditor())), [])
  return {editor}
}

function CustomSlate(props) {
  let {editor, initialValue = editorDefault.value.default} = props
  let {readOnly, onKeyDown, onKeyUp, className} = props;
  let editableProps = {
    renderElement: innerProps => <ElementRenderer {...innerProps}/>,
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