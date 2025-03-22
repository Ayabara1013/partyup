'use client'
import {isKeyHotkey} from "is-hotkey";
import {CustomSlate, useCustomEditorHook} from "@components/slatejs/slatejs";
import {editorFix, editorTools} from "@/javascript/slateInput/editorUtil";
import {useRef} from "react";
import {useChatOptions} from "@app/games/play/[gameId]/(components)/(chatOptions)/chatOptionHook";
import ChatOptionList from "@app/games/play/[gameId]/(components)/(chatOptions)/chatOptionList";
import {editorDefault} from "@/javascript/slateInput/defulatValues";
import {fbGameChatManager} from "@/javascript/firebase/managers/fbGameChatManager";

export default function ChatInput({name, gid, className, chatPerm}) {
  const {editor} = useCustomEditorHook();
  const activePlayers = editorDefault.activePlayers
  const chatOptionsRefs = {
    mainRef: useRef(null),
    optionRefs: [
      useRef(null), useRef(null), useRef(null),
      useRef(null), useRef(null), useRef(null),
      useRef(null), useRef(null), useRef(null)
    ]
  }

  const callout = useChatOptions(chatOptionsRefs, editor);

  const onKeyDown = (e) => {
    editorFix.keyDown(e, editor);
    let block = callout.cycleOptionIndex(e);
    //Make new line while holding shift.
    if (isKeyHotkey(`enter+shift`, e.nativeEvent)) {
      return;
    }
    //Enter to send
    if (!block && isKeyHotkey(`enter`, e.nativeEvent)) {
      e.preventDefault();
      fbGameChatManager.add.message(name, gid, editorTools.getEditorStringValue(editor)).then();
      editorTools.resetEditor(editor);
    }
    //Enter to select current highlighted option
    if (block && isKeyHotkey('enter', e.nativeEvent)) {
      e.preventDefault();
      // callout.selectOption();
      // editorTools.resetEditor(editor);
    }

  }
  const onKeyUp = (e) => {
    console.log({
      ogArray: editor.children,
      text: editorTools.getEditorStringValue(editor),
      // newArray: editorTools.toEditorFormat(editorTools.getEditorStringValue(editor)),
      // compareValue: editorTools.compareValues(editor.children, editor.children)

    })

    if (!isKeyHotkey(`escape`, e.nativeEvent)) {
      callout.updateOptionsFilter(activePlayers);
    }
    editorFix.keyUp(e, editor);
  }

  return (
    <div className="min-w-full w-0" ref={chatOptionsRefs.mainRef}>
      <ChatOptionList {...callout.optionProps()} chatOptionsRefs={chatOptionsRefs}/>
      <CustomSlate readOnly={false} {...{onKeyDown, onKeyUp, editor, className}}/>
    </div>
  )
}
