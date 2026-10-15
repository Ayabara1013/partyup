import {KeyboardEvent, useState} from "react";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import {mentionsToNames, namesToMentions} from "@/app/games/play/[gameId]/(components)/chat/message/messageUtil";

type MessageEditorProps = {
    message: any;
    game: any;
    onClose: () => void;
};

// Inline Discord-style editor for a chat message: Enter saves, Shift+Enter adds a line, Escape cancels.
export default function ChatMessageEditor({message, game, onClose}: MessageEditorProps) {
    // Show mentions as @Name while editing; they're turned back into <@id> on save
    const [draft, setDraft] = useState(() => mentionsToNames(message.messageText ?? ``, game));

    const save = async () => {
        const text = namesToMentions(draft.trim(), game);
        if (text && text !== message.messageText) {
            if (!await supabaseInGame.edit.message.text(message.id, text)) return;
        }
        onClose();
    }

    const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === `Enter` && !e.shiftKey) {
            e.preventDefault();
            save();
        } else if (e.key === `Escape`) {
            onClose();
        }
    }

    return (
        <div className="msg__editor">
            <textarea className="textarea textarea-bordered textarea-sm w-full text-base-content"
                      value={draft} autoFocus rows={Math.min(6, draft.split(`\n`).length)}
                      onChange={(e) => setDraft(e.target.value)} onKeyDown={onKeyDown}/>
            <div className="msg__editor-hint">
                escape to <button className="link" onClick={onClose}>cancel</button>
                {` • `}enter to <button className="link" onClick={save}>save</button>
            </div>
        </div>
    );
}
