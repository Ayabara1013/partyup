'use client'

import '@/styles/games/play/chatWindow.scss';
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import msgArrayManipulation from "@/lib/supabase/util/msgArrayManipulation";
import {ChatMessage} from "@/app/games/play/[gameId]/(components)/chat/message/chatMessage";
import {useAuthManager} from "@/app/(context)/authContext";
import ChatInput from "@/app/games/play/[gameId]/(components)/chat/input/chatInput";
import PinnedChatMessages from "@/app/games/play/[gameId]/(components)/chat/window/pinnedChatMessages";

// Consecutive messages from the same author within this window are grouped under one header.
const GROUP_GAP_MS = 7 * 60 * 1000;

const CHANNEL_DESCRIPTIONS: Record<string, string> = {
    canon: `The story so far`,
    turn: `In character, on your turn`,
    open: `Out of character`,
};

export function ChatWindow(
    {messages, game, settings, name}: { messages: Array<any>, game: any, settings: any, name: string }
) {
    const windowEnd = useRef<HTMLDivElement | null>(null);
    const {user} = useAuthManager();
    const [replyTo, setReplyTo] = useState<any>(null);

    // All messages (any channel), so replies can show messages from other chats
    const messagesById = useMemo(() => new Map(messages.map((m) => [m.id, m])), [messages]);

    const canTalk = game.gmUid === user?.id
        || (name === `turn` && (settings.talkingStick === user?.id || settings.rollingStick === user?.id))
        || (name === `open` && !settings.openMute?.[user?.id ?? '']);

    // A pending reply is dropped while you can't talk here (talking stick moved, muted)
    const activeReply = canTalk ? replyTo : null;
    const cancelReply = useCallback(() => setReplyTo(null), []);

    const messageAreaRef = useRef<HTMLDivElement | null>(null);

    // Pinned messages in this chat, newest first
    const pinned = useMemo(() => messages
        .filter((m) => m.isPinned && !m.deleted && m.channel.includes(name))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()), [messages, name]);

    function jumpToMessage(messageId: string) {
        const el = messageAreaRef.current?.querySelector(`[data-msg-id="${messageId}"]`);
        if (!el) return;
        el.scrollIntoView({behavior: `smooth`, block: `center`});
        el.classList.add(`msg--flash`);
        setTimeout(() => el.classList.remove(`msg--flash`), 1500);
    }

    useEffect(() => {
        windowEnd.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, [messages])

    const disableContextMenu = (e: any) => {
        e.preventDefault();
    }

    // This chat's messages in order, each flagged with whether it starts a new group (shows a header).
    // Only recomputed when the message list changes, and the original objects are kept so
    // ChatMessage's memo can skip unchanged rows.
    const rows = useMemo(() => {
        const channelMessages = messages.filter((m) => m.channel.includes(name) && !m.deleted);
        msgArrayManipulation.sortByCreated(channelMessages);
        return channelMessages.map((m, i) => {
            const prev = channelMessages[i - 1];
            const gap = prev ? new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() : 0;
            const header = i === 0 || prev.playerId !== m.playerId || !!prev.system !== !!m.system
                || gap > GROUP_GAP_MS || !!m.replyTo;
            return {message: m, header};
        });
    }, [messages, name]);

    const isGm = game.gmUid === user?.id;
    const notice = name === `canon` ? `Only the GM can post in Canon.`
        : name === `turn` ? `Wait for your turn to post.`
            : `You're muted in Open chat.`;

    return (
        <section className={`panel chat-window`} onContextMenu={disableContextMenu}>
            <header className={`panel__bar`}>
                <div className={`panel__title`}>
                    <span className={`panel__name`}>{name}</span>
                    <span className={`panel__desc`}>{CHANNEL_DESCRIPTIONS[name]}</span>
                </div>
                <PinnedChatMessages pinned={pinned} game={game} isGm={isGm} onJump={jumpToMessage}/>
            </header>

            <div className={`message-area chat-window__messages`} ref={messageAreaRef}>
                {rows.map(({message, header}) =>
                    <ChatMessage key={message.id} message={message} header={header} game={game} userId={user?.id}
                                 channelName={name} canTalk={canTalk} onReply={setReplyTo}
                                 repliedMessage={message.replyTo ? messagesById.get(message.replyTo) : undefined}/>
                )}
                <div ref={windowEnd}/>
            </div>

            <div className={`chat-window__composer`}>
                {/* Stays mounted while you can't talk, so a half-written message isn't lost */}
                <ChatInput hidden={!canTalk} name={name} game={game} replyTo={activeReply} onCancelReply={cancelReply}/>
                {!canTalk && <div className={`chat-window__notice`}>{notice}</div>}
            </div>
        </section>)
}
