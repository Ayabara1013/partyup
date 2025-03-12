'use client'
import {isKeyHotkey} from "is-hotkey";
import {CustomSlate, useCustomEditorHook} from "@components/slatejs/slatejs";

import ChatOptionList from "@app/games/play/[gameId]/(components)/(chatOptions)/chatOptionList";

import {useCallout} from "@app/games/play/[gameId]/(components)/(chatOptions)/optionHook";

import {ui} from "@/javascript/ui";
import {editorDefault} from "@/javascript/slateInput/defulatValues";
import {editorFix, editorTools} from "@/javascript/slateInput/editorUtil";

export default function ChatInput(props) {
  let {
    activePlayers = editorDefault.activePlayers,
    game,
    window,
    chatPermissions,
    className
  } = props;
  const {editor} = useCustomEditorHook();
  //const callout = useCallout(id, editor);

  const canMessage = () => {
    if (chatPermissions === undefined) return false;
    let {initMuted, initAllow} = chatPermissions;
    return (!initMuted && initAllow);
  }
  const onKeyDown = (e) => {
    editorFix.keyDown(e, editor);
    let block = false //callout.find(e);

    if (!block && isKeyHotkey('enter', e.nativeEvent)) {
      e.preventDefault();
      // editorTools.resetEditor(editor);
      console.log(editorTools.printValues(editor.children))
    }
  }
  const onKeyUp = (e) => {
    //callout.update(activePlayers);
    editorFix.keyUp(e, editor);
  }

  return (
    <div className="min-w-full w-0">
      {/*<ChatOptionList {...callout.optionProps()}/>*/}
      <CustomSlate readOnly={canMessage()} {...{onKeyDown, onKeyUp, editor, className}}/>
    </div>
  )
}
