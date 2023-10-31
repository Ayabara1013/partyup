'use client'
import { isKeyHotkey } from "is-hotkey";

import CalloutList from "@/app/(game)/play/(chat-window)/(chatInput)/(callout)/(components)/calloutList";

import { useCallout } from "@/app/(game)/play/(chat-window)/(chatInput)/(callout)/calloutHook";
import { editorFix, editorTools } from "@/components/slatejs/(util)/editorUtil";
import { editorDefault } from "@/components/slatejs/(util)/defulatValues";
import { messaging } from "@/javascript/firebase/messaging";
import { CustomSlate, useCustomEditorHook } from "@/components/slatejs/slatejs";

export default function ChatInput(props) {
  let { id = 'chatCustomInput', activePlayers = editorDefault.activePlayers, game, window, } = props;
  const { editor } = useCustomEditorHook();

  const { calloutProps, updateCalloutUi, lookForCallout } = useCallout(id);

  const onKeyDown = (e) => {
    editorFix.keyDown(e, editor);
    let block = lookForCallout(e, editor);

    if (!block && isKeyHotkey('enter', e.nativeEvent)) {
      e.preventDefault();
      let message = JSON.stringify(editor.children);
      messaging.game.addMessage(game, window, message, []);
      editorTools.resetEditor(editor);
    }
  }
  const onKeyUp = (e) => {
    updateCalloutUi(editorTools.offset.focusedFragment(editor), activePlayers);
    editorFix.keyUp(e, editor);
  }

  return (
    <div className="w-full border" id={id + 'slateInput'}>
      <CalloutList className="bg-slate-900 rounded" {...calloutProps(editor)}/>
      <CustomSlate editor={editor} onKeyDown={onKeyDown} onKeyUp={onKeyUp}/>
    </div>
  )
}
