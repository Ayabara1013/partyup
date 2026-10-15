import {memo} from "react";
import {authorName, previewText} from "@/app/games/play/[gameId]/(components)/chat/message/messageUtil";

type ChatReplyHeaderProps = {
    replyTo: any;
    game: any;
    onCancel: () => void;
};

// "Replying to Name — message…  ✕" bar shown above the chat input.
function ChatReplyHeader({replyTo, game, onCancel}: ChatReplyHeaderProps) {
    return (
        <div className="chat-reply-bar">
            <span className="chat-reply-bar__label">Replying to</span>
            <span className="chat-reply-bar__name">{authorName(replyTo, game)}</span>
            <span className="chat-reply-bar__text">{previewText(replyTo, game)}</span>
            <button className="btn btn-ghost btn-xs btn-circle" onClick={onCancel} aria-label="Cancel reply">✕</button>
        </div>
    );
}

export default memo(ChatReplyHeader);
