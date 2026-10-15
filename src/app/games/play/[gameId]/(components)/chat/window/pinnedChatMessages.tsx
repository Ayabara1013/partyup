'use client'

import {useEffect, useRef, useState} from "react";
import ChatMessageRenderer from "@/app/games/play/[gameId]/(components)/chat/message/chatMessageRenderer";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import {
    authorName, findAuthor, formatDiscordTime, gameMembers
} from "@/app/games/play/[gameId]/(components)/chat/message/messageUtil";

type PinnedMessagesProps = {
    pinned: any[];
    game: any;
    isGm: boolean;
    onJump: (messageId: string) => void;
};

// Pin button for a chat window header; opens a Discord-style "Pinned Messages" popover.
export default function PinnedChatMessages({pinned, game, isGm, onJump}: PinnedMessagesProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    // Close on outside click or Escape
    useEffect(() => {
        if (!open) return;
        const onPointerDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === `Escape`) setOpen(false);
        };
        document.addEventListener(`pointerdown`, onPointerDown);
        document.addEventListener(`keydown`, onKeyDown);
        return () => {
            document.removeEventListener(`pointerdown`, onPointerDown);
            document.removeEventListener(`keydown`, onKeyDown);
        };
    }, [open]);

    return (
        <div className="pinned" ref={rootRef}>
            <button className={`pinned__button ${open ? `pinned__button--open` : ``}`}
                    onClick={() => setOpen((o) => !o)} aria-label="Pinned messages" title="Pinned Messages">
                <PinIcon/>
                {pinned.length > 0 && <span className="pinned__count">{pinned.length}</span>}
            </button>

            {open &&
              <div className="pinned__popover">
                <div className="pinned__title">Pinned Messages</div>
                <div className="pinned__list">
                    {pinned.length === 0
                        ? <div className="pinned__empty">This chat doesn't have any pinned messages yet.</div>
                        : pinned.map((message) =>
                            <PinnedCard key={message.id} message={message} game={game} isGm={isGm}
                                        onJump={() => {
                                            setOpen(false);
                                            onJump(message.id);
                                        }}/>)
                    }
                </div>
              </div>
            }
        </div>
    );
}

function PinnedCard({message, game, isGm, onJump}: { message: any, game: any, isGm: boolean, onJump: () => void }) {
    const name = authorName(message, game);
    const avatarUrl = findAuthor(game, message.playerId)?.imageUrl;
    const time = message.createdAt ? formatDiscordTime(new Date(message.createdAt)) : ``;

    return (
        <div className="pinned__card">
            {avatarUrl
                ? <img className="pinned__avatar" src={avatarUrl} alt=""/>
                : <div className="pinned__avatar pinned__avatar--fallback">{name.charAt(0).toUpperCase()}</div>}
            <div className="pinned__content">
                <div className="msg__header">
                    <span className="msg__name">{name}</span>
                    <time className="msg__time">{time}</time>
                </div>
                <div className="msg__body">
                    <ChatMessageRenderer messageText={message.messageText} players={gameMembers(game)}/>
                </div>
            </div>
            <div className="pinned__actions">
                <button className="btn btn-xs" onClick={onJump}>Jump</button>
                {isGm &&
                  <button className="btn btn-xs btn-ghost btn-circle" aria-label="Unpin message" title="Unpin"
                          onClick={() => supabaseInGame.edit.message.pinned(message.id, false)}>✕
                  </button>
                }
            </div>
        </div>
    );
}

// Lucide "pin" icon (ISC license)
function PinIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 17v5"/>
            <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
        </svg>
    );
}
