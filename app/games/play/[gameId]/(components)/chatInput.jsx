'use client'
import {isKeyHotkey} from "is-hotkey";
import {CustomSlate, useCustomEditorHook} from "@components/slatejs/slatejs";
import {editorFix, editorTools} from "@/javascript/slateInput/editorUtil";
import {useRef} from "react";
import {useChatOptions} from "@app/games/play/[gameId]/(components)/(chatOptions)/chatOptionHook";
import ChatOptionList from "@app/games/play/[gameId]/(components)/(chatOptions)/chatOptionList";
import markdownParser from "@/javascript/slateInput/markdownParser";
import {fbGameChatManager} from "@/javascript/firebase/managers/fbGameChatManager";
import messageParser from "@/javascript/firebase/functions/messageParser";

export default function ChatInput({name, gid, className, players}) {
  const {editor} = useCustomEditorHook();
  const chatOptionsRefs = {
    mainRef: useRef(null),
    optionRefs: [
      useRef(null), useRef(null), useRef(null),
      useRef(null), useRef(null), useRef(null),
      useRef(null), useRef(null), useRef(null)
    ]
  }
  const callout = useChatOptions(chatOptionsRefs, editor, players);

  const onKeyDown = (e) => {
    let block = callout.cycleOptionIndex(e);
    //Make new line while holding shift.
    if (isKeyHotkey(`enter+shift`, e.nativeEvent)) {
      return;
    }
    //Enter to send
    if (!block && isKeyHotkey(`enter`, e.nativeEvent)) {
      e.preventDefault();
      // let og = editor.children
      // let text = editorTools.getEditorStringValue(editor)
      // let attempt = markdownParser.toDisplay(text, players)
      // console.log({og, attempt})
      // console.log(messageParser.parseDice(text))
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
    // console.log({
    //   ogArray: editor.children,
    //   text: editorTools.getEditorStringValue(editor),
    //   newArray: editorTools.toEditorFormat(editorTools.getEditorStringValue(editor)),
    //   compareValue: editorTools.compareValues(editor.children, editor.children)
    // })

    if (!isKeyHotkey(`escape`, e.nativeEvent)) {
      callout.updateOptionsFilter();
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
