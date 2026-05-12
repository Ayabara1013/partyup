"use client";

import isHotkey from "is-hotkey";
import {useRef} from "react";
import type {KeyboardEvent} from "react";
import {CustomSlate, useCustomEditorHook} from "@/components/slatejs/slatejs";
import ChatOptionList from "@/app/games/play/[gameId]/(components)/chat/(chatOptions)/chatOptionsList";
import {useChatOptions} from "@/app/games/play/[gameId]/(components)/chat/(chatOptions)/chatOptionsHook";
import {editorFix, editorTools} from "@/components/slatejs/util/editorUtil";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import {useAuthManager} from "@/app/(context)/authContext";


type ChatInputProps = {
    name: string;
    className?: string;
    game: any;
};

export default function ChatInput({name, className, game,}: ChatInputProps) {
    const {user} = useAuthManager();
    const {editor} = useCustomEditorHook();

    const chatOptionsRefs = {
        mainRef: useRef<HTMLDivElement | null>(null),
        optionRefs: [
            useRef<HTMLButtonElement | null>(null),
            useRef<HTMLButtonElement | null>(null),
            useRef<HTMLButtonElement | null>(null),
            useRef<HTMLButtonElement | null>(null),
            useRef<HTMLButtonElement | null>(null),
            useRef<HTMLButtonElement | null>(null),
            useRef<HTMLButtonElement | null>(null),
            useRef<HTMLButtonElement | null>(null),
            useRef<HTMLButtonElement | null>(null),
        ],
    };

    const chatOptions = useChatOptions(chatOptionsRefs, editor, game);

    const onKeyDown = async (e: KeyboardEvent<HTMLDivElement>) => {
        const block = chatOptions.cycleOptionIndex(e);

        if (isHotkey("shift+enter", e.nativeEvent)) {
            return;
        }

        if (!block && isHotkey("enter", e.nativeEvent)) {
            e.preventDefault();
            supabaseInGame.set.addMessage(game.id, editorTools.getEditorStringValue(editor), user?.id ?? '', name)
            editorTools.resetEditor(editor);
        }

        if (block && isHotkey("enter", e.nativeEvent)) {
            e.preventDefault();
        }
    };

    const onKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
        if (!isHotkey("escape", e.nativeEvent)) {
            chatOptions.updateOptionsFilter(["roll", "r"]);
        }

        editorFix.keyUp(e, editor);
    };

    return (
        <div className="min-w-full w-0" ref={chatOptionsRefs.mainRef}>
            <ChatOptionList{...chatOptions.optionProps()} chatOptionsRefs={chatOptionsRefs}/>

            <CustomSlate
                readOnly={false}
                onKeyDown={onKeyDown} onKeyUp={onKeyUp}
                editor={editor} className={className}
            />
        </div>
    );
}