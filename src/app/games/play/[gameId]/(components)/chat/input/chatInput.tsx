"use client";

import isHotkey from "is-hotkey";
import {useEffect} from "react";
import {ReactEditor} from "slate-react";
import type {KeyboardEvent} from "react";
import {CustomSlate, useCustomEditorHook} from "@/components/slatejs/slatejs";
import ChatOptionHeader from "@/app/games/play/[gameId]/(components)/chat/input/header/chatOptionHeader";
import {useChatOptions} from "@/app/games/play/[gameId]/(components)/chat/input/header/chatOptionsHook";
import {editorFix, editorTools} from "@/components/slatejs/util/editorUtil";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import {useAuthManager} from "@/app/(context)/authContext";
import ChatReplyHeader from "@/app/games/play/[gameId]/(components)/chat/input/header/chatReplyHeader";


// Slash commands offered in the suggestion list
const CHAT_COMMANDS = [`roll`, `r`];

type ChatInputProps = {
    name: string;
    hidden?: boolean;
    game: any;
    replyTo?: any;
    onCancelReply?: () => void;
};

export default function ChatInput({name, hidden, game, replyTo, onCancelReply}: ChatInputProps) {
    const {user} = useAuthManager();
    const {editor} = useCustomEditorHook();

    const chatOptions = useChatOptions(editor, game);

    useEffect(() => {
        if (replyTo) ReactEditor.focus(editor);
    }, [replyTo, editor]);

    const onKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
        const block = chatOptions.cycleOptionIndex(e);

        if (isHotkey("backspace", e.nativeEvent) && editorTools.removeBadgeBeforeCursor(editor)) {
            e.preventDefault();
            return;
        }
        if (isHotkey("shift+enter", e.nativeEvent)) {
            return;
        }

        if (!block && isHotkey("enter", e.nativeEvent)) {
            e.preventDefault();
            supabaseInGame.set.addMessage(game.id, editorTools.getEditorStringValue(editor), user?.id ?? '', name,
                null, replyTo?.id ?? null)
            editorTools.resetEditor(editor);
            onCancelReply?.();
        }

        if (block && isHotkey("enter", e.nativeEvent)) {
            e.preventDefault();
        }
    };

    const onKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!isHotkey("escape", e.nativeEvent)) {
            chatOptions.updateOptionsFilter(CHAT_COMMANDS);
        }

        editorFix.keyUp(e, editor);
    };

    return (
        <div className={`chat-composer ${hidden ? `hidden` : ``}`}>
            {/* Popups stacked above the input: reply preview on top, then command/mention options */}
            <div className="chat-input__popups">
                {replyTo && onCancelReply && <ChatReplyHeader replyTo={replyTo} game={game} onCancel={onCancelReply}/>}
                <ChatOptionHeader {...chatOptions.headerProps}/>
            </div>

            <div className="chat-composer__field">
                <CustomSlate readOnly={false} onKeyDown={onKeyDown} onKeyUp={onKeyUp}
                             editor={editor} className="chat-composer__editor"
                             placeholder={`Message #${name}`}/>
            </div>
        </div>
    );
}