"use client";

import isHotkey from "is-hotkey";
import {memo, useEffect} from "react";
import {ReactEditor} from "slate-react";
import type {KeyboardEvent} from "react";
import {CustomSlate, useCustomEditorHook} from "@/components/slatejs/slatejs";
import ChatOptionHeader from "@/app/games/play/[gameId]/(components)/chat/input/header/chatOptionHeader";
import {useChatOptions} from "@/app/games/play/[gameId]/(components)/chat/input/header/chatOptionsHook";
import {editorFix, editorTools} from "@/components/slatejs/util/editorUtil";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import ChatReplyHeader from "@/app/games/play/[gameId]/(components)/chat/input/header/chatReplyHeader";


// Slash commands offered in the suggestion list
const CHAT_COMMANDS = [`roll`];

type ChatInputProps = {
    name: string;
    hidden?: boolean;
    game: any;
    replyTo?: any;
    onCancelReply?: () => void;
    userId: string | undefined;
};

// memo: new messages in the window don't re-render the composer (its props stay the same)
export default memo(function ChatInput({name, hidden, game, replyTo, onCancelReply, userId}: ChatInputProps) {
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
            const text = editorTools.getEditorStringValue(editor);
            // Nothing but spaces or blank lines: send nothing, keep the editor and the reply as they are
            if (!text.trim()) return;
            supabaseInGame.set.addMessage(game.id, text, userId ?? '', name, null, replyTo?.id ?? null)
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
});