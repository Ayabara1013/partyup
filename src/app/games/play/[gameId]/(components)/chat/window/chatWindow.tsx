'use client'

import '@/styles/games/play/chatWindow.scss';
import {Fragment, memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import {createdMs} from "@/lib/supabase/util/msgArrayManipulation";
import type {CachedMessage, ChatChannel} from "@/lib/util/localStorage";
import {ChatMessage} from "@/app/games/play/[gameId]/(components)/chat/message/chatMessage";
import ChatInput from "@/app/games/play/[gameId]/(components)/chat/input/chatInput";
import PinnedChatMessages from "@/app/games/play/[gameId]/(components)/chat/window/pinnedChatMessages";

// Consecutive messages from the same author within this window are grouped under one header.
const GROUP_GAP_MS = 7 * 60 * 1000;

// Within this distance of the bottom, the window follows new messages
const NEAR_BOTTOM_PX = 80;

// Rows drawn when a window opens, and how many more each time the reader scrolls up to the top of them
const FIRST_ROWS = 250;
const MORE_ROWS = 50;
// Within this distance of the top, scrolling up draws earlier rows
const NEAR_TOP_PX = 4;

// Where the drawn rows start: a row's created time and id (the list is sorted by both), so the start stays put when
// messages are added at the end or deleted
type RowStart = { ms: number, id: string };
const atOrAfter = (m: CachedMessage, s: RowStart) => createdMs(m) > s.ms || (createdMs(m) === s.ms && m.id >= s.id);
const after = (m: CachedMessage, s: RowStart) => createdMs(m) > s.ms || (createdMs(m) === s.ms && m.id > s.id);

// Index of the first row after a position (rows.length if none). The rows are sorted, so it walks back from the end.
function firstAfter(rows: { message: CachedMessage }[], from: RowStart) {
    let i = rows.length;
    while (i > 0 && after(rows[i - 1].message, from)) i--;
    return i;
}

// Scrolls a drawn message into the middle of its chat and flashes it
function flashRow(area: HTMLElement | null, messageId: string) {
    const el = area?.querySelector(`[data-msg-id="${messageId}"]`);
    if (!el) return;
    el.scrollIntoView({behavior: `smooth`, block: `center`});
    el.classList.add(`msg--flash`);
    setTimeout(() => el.classList.remove(`msg--flash`), 1500);
}

const CHANNEL_DESCRIPTIONS: Record<string, string> = {
    canon: `The story so far`,
    turn: `In character, on your turn`,
    open: `Out of character`,
};

type ChatWindowProps = {
    messages: CachedMessage[];                // every message in the game (any channel), oldest first
    messagesById: Map<string, CachedMessage>; // the same messages by id, so replies can show other chats' messages
    game: any;
    settings: any;
    name: ChatChannel;
    userId: string | undefined;
    showDeleted: boolean;                     // the GM's switch: keep deleted messages (drawn faded)
};

// memo: a refresh of the game lists (or any other page render that leaves these props alone) skips the chat
export const ChatWindow = memo(function ChatWindow(
    {messages, messagesById, game, settings, name, userId, showDeleted}: ChatWindowProps
) {
    const windowEnd = useRef<HTMLDivElement | null>(null);
    const [replyTo, setReplyTo] = useState<any>(null);

    const canTalk = game.gmUid === userId
        || (name === `turn` && (settings.talkingStick === userId || settings.rollingStick === userId))
        || (name === `open` && !settings.openMute?.[userId ?? '']);

    // A pending reply is dropped while you can't talk here (talking stick moved, muted)
    const activeReply = canTalk ? replyTo : null;
    const cancelReply = useCallback(() => setReplyTo(null), []);

    const messageAreaRef = useRef<HTMLDivElement | null>(null);

    // Pinned messages in this chat, newest first (the list is oldest first)
    const pinned = useMemo(() => messages
        .filter((m) => m.isPinned && !m.deleted && m.channel.includes(name))
        .reverse(), [messages, name]);

    // Follows new messages only while the reader is at the bottom: scrolling up stops it, scrolling back down
    // resumes it. Only an upward scroll turns it off, so the smooth scroll to a new message never does.
    const followNew = useRef(true);
    const lastScrollTop = useRef(0);

    // This chat's messages in order (the list is already sorted), each flagged with whether it starts a new group
    // (shows a header). The original objects are kept so ChatMessage's memo can skip unchanged rows.
    const rows = useMemo(() => {
        const channelMessages = messages.filter((m) => m.channel.includes(name) && (showDeleted || !m.deleted));
        return channelMessages.map((m, i) => {
            const prev = channelMessages[i - 1];
            const gap = prev ? createdMs(m) - createdMs(prev) : 0;
            const header = i === 0 || prev.playerId !== m.playerId || !!prev.system !== !!m.system
                || gap > GROUP_GAP_MS || !!m.replyTo;
            return {message: m, header};
        });
    }, [messages, name, showDeleted]);

    // null: the last FIRST_ROWS rows, sliding with new messages while you follow them. Set the first time you scroll
    // up (and moved up when earlier rows are drawn or you jump), so new messages don't push rows out above you.
    const [startAt, setStartAt] = useState<RowStart | null>(null);
    const start = useMemo(() => {
        const latest = Math.max(0, rows.length - FIRST_ROWS);
        if (!startAt) return latest;
        const i = rows.findIndex(({message}) => atOrAfter(message, startAt));
        return i < 0 ? latest : i;
    }, [rows, startAt]);
    const startOf = (i: number): RowStart => ({ms: createdMs(rows[i].message), id: rows[i].message.id});

    // Set when you leave the bottom: the last row then. Rows after it are new to you; the button shows while it's set.
    const [awayFrom, setAwayFrom] = useState<RowStart | null>(null);

    // Messages that became the newest in this chat since you left the bottom, not counting your own. Edits and pins
    // change no row; a new message deleted before you're back leaves the rows, so it drops out of the count.
    const newCount = useMemo(() => {
        if (!awayFrom) return 0;
        let count = 0;
        for (let i = rows.length - 1; i >= 0 && after(rows[i].message, awayFrom); i--) {
            const m = rows[i].message;
            if (m.system || !userId || m.playerId !== userId) count++;
        }
        return count;
    }, [rows, awayFrom, userId]);

    // The line: above the first new row while you're away; it goes once you're back at the bottom
    const newLineIndex = useMemo(() => {
        if (!awayFrom || newCount === 0) return -1;
        const i = firstAfter(rows, awayFrom);
        return i < rows.length ? i : -1;
    }, [rows, awayFrom, newCount]);

    // Back at the bottom (scrolled there, or the button): the button and the line go
    const backAtBottom = () => {
        followNew.current = true;
        if (awayFrom) setAwayFrom(null);
    };

    const toLatest = () => {
        backAtBottom();
        windowEnd.current?.scrollIntoView({behavior: `smooth`, block: `start`});
    };

    // Scroll position before earlier rows are drawn above, to keep the view where it was
    const restoreFrom = useRef<{ height: number, top: number } | null>(null);

    const onScroll = () => {
        const area = messageAreaRef.current;
        if (!area) return;
        const up = area.scrollTop < lastScrollTop.current;
        if (area.scrollHeight - area.scrollTop - area.clientHeight < NEAR_BOTTOM_PX) backAtBottom();
        else if (up) {
            followNew.current = false;
            // Leaving the bottom: what comes after the current last row is new (set once per trip up)
            if (!awayFrom && rows.length > 0) setAwayFrom(startOf(rows.length - 1));
        }
        lastScrollTop.current = area.scrollTop;
        if (!up || rows.length === 0) return;

        if (area.scrollTop <= NEAR_TOP_PX && start > 0) {
            // Reached the first drawn row: draw MORE_ROWS earlier ones and keep your place
            restoreFrom.current = {height: area.scrollHeight, top: area.scrollTop};
            setStartAt(startOf(Math.max(0, start - MORE_ROWS)));
        } else if (!startAt && !followNew.current) {
            setStartAt(startOf(start)); // reading back: stop sliding (same rows, nothing moves)
        }
    };

    // After earlier rows are drawn above: move the scroll position down by their height, so the view stays put
    useLayoutEffect(() => {
        const area = messageAreaRef.current;
        const from = restoreFrom.current;
        if (!area || !from) return;
        restoreFrom.current = null;
        area.scrollTop = from.top + (area.scrollHeight - from.height);
    }, [start]);

    // Scrolls to a message of this chat and flashes it. If it isn't drawn yet, or is drawn but so close to the first
    // drawn row that scrolling there would reach the top (and draw more mid-scroll), it first draws a batch above it.
    // Stable: it reads the rows through a ref.
    const view = useRef({rows, start});
    useEffect(() => {
        view.current = {rows, start};
    }, [rows, start]);
    const pendingJump = useRef<string | null>(null);
    const jumpToMessage = useCallback((messageId: string) => {
        const {rows, start} = view.current;
        const i = rows.findIndex(({message}) => message.id === messageId);
        if (i < 0) return; // not in this chat
        if (i >= start && (start === 0 || i - start >= MORE_ROWS)) return flashRow(messageAreaRef.current, messageId);
        pendingJump.current = messageId;
        const from = rows[Math.max(0, i - MORE_ROWS)].message;
        setStartAt({ms: createdMs(from), id: from.id});
    }, []);
    useEffect(() => {
        const id = pendingJump.current;
        if (!id) return;
        pendingJump.current = null;
        flashRow(messageAreaRef.current, id);
    }, [start]);

    // Scroll when this chat gets a new last message (not for edits, pins or deletes further up).
    // Your own new message always scrolls into view, and following resumes from there.
    const lastMessage = rows.length > 0 ? rows[rows.length - 1].message : null;
    const lastRowId = lastMessage?.id ?? null;
    const lastIsMine = !!lastMessage && !lastMessage.system && !!userId && lastMessage.playerId === userId;
    useEffect(() => {
        if (!lastRowId) return;
        if (lastIsMine) followNew.current = true;
        if (followNew.current) windowEnd.current?.scrollIntoView({behavior: 'smooth', block: 'start'});
    }, [lastRowId, lastIsMine]);

    const isGm = game.gmUid === userId;
    const notice = name === `canon` ? `Only the GM can post in Canon.`
        : name === `turn` ? `Wait for your turn to post.`
            : `You're muted in Open chat.`;

    return (
        <section className={`panel chat-window`}>
            <header className={`panel__bar`}>
                <div className={`panel__title`}>
                    <span className={`panel__name`}>{name}</span>
                    <span className={`panel__desc`}>{CHANNEL_DESCRIPTIONS[name]}</span>
                </div>
                <PinnedChatMessages pinned={pinned} game={game} isGm={isGm} onJump={jumpToMessage}/>
            </header>

            <div className={`chat-window__body`}>
                <div className={`message-area chat-window__messages thin-scrollbar`} ref={messageAreaRef} onScroll={onScroll}>
                    {/* The first drawn row, and the row under the "New messages" line, always show their header */}
                    {rows.slice(start).map(({message, header}, i) =>
                        <Fragment key={message.id}>
                            {start + i === newLineIndex && <div className={`chat-window__new-line`}>New messages</div>}
                            <ChatMessage message={message} header={header || i === 0 || start + i === newLineIndex}
                                         game={game} userId={userId} channelName={name} canTalk={canTalk}
                                         onReply={setReplyTo} onJump={jumpToMessage}
                                         repliedMessage={message.replyTo ? messagesById.get(message.replyTo) : undefined}/>
                        </Fragment>
                    )}
                    <div ref={windowEnd}/>
                </div>

                {awayFrom &&
                  <button type="button" onClick={toLatest}
                          className={`chat-window__latest ${newCount > 0 ? `chat-window__latest--new` : ``}`}
                          aria-label={newCount > 0 ? `${newCount} new, jump to the latest message` : `Jump to the latest message`}>
                      <ArrowDownIcon/>
                      <span aria-live="polite">{newCount > 0 && `${newCount} new message${newCount === 1 ? `` : `s`}`}</span>
                  </button>}
            </div>

            <div className={`chat-window__composer`}>
                {/* Stays mounted while you can't talk, so a half-written message isn't lost. Players never get one in
                    Canon, where they can never post. */}
                {(name !== `canon` || isGm) &&
                  <ChatInput hidden={!canTalk} name={name} game={game} replyTo={activeReply} onCancelReply={cancelReply}
                             userId={userId}/>}
                {!canTalk && <div className={`chat-window__notice`}>{notice}</div>}
            </div>
        </section>)
});

// Lucide "arrow-down" icon (ISC license)
function ArrowDownIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 5v14"/>
            <path d="m19 12-7 7-7-7"/>
        </svg>
    );
}
