'use client'
import { isKeyHotkey } from "is-hotkey";
import { CustomSlate, useCustomEditorHook } from "@/components/slatejs/slatejs";

import ChatOptionList from "@/app/(game)/play/(chat-window)/(chatInput)/(chatOptions)/chatOptionList";

import { useCallout } from "@/app/(game)/play/(chat-window)/(chatInput)/(chatOptions)/optionHook";

import { ui } from "@/javascript/ui";
import { messaging } from "@/javascript/firebase/messaging";
import { editorDefault } from "@/components/slatejs/(util)/defulatValues";
import { editorFix, editorTools } from "@/components/slatejs/(util)/editorUtil";

export default function ChatInput(props) {
  let { id = 'chatCustomInput', activePlayers = editorDefault.activePlayers, game, window, } = props;
  const { editor } = useCustomEditorHook();
  const callout = useCallout(id, editor);

  const onKeyDown = (e) => {
    editorFix.keyDown(e, editor);
    let block = callout.find(e);

    if (!block && isKeyHotkey('enter', e.nativeEvent)) {
      e.preventDefault();
      let message = JSON.stringify(editor.children);
      messaging.game.addMessage(game, window, message, []);
      editorTools.resetEditor(editor);
    }
  }
  const onKeyUp = (e) => {
    callout.update(activePlayers);
    editorFix.keyUp(e, editor);
  }

  return (
    <div className="w-full border" id={id + 'slateInput'}>
      <ChatOptionList className="bg-slate-900 rounded" id={id + ui.messaging.initOptions.id} {...callout.optionProps()}/>
      <CustomSlate editor={editor} onKeyDown={onKeyDown} onKeyUp={onKeyUp}/>
    </div>
  )
}
