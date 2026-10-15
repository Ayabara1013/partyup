import {memo, useMemo, useState} from "react";
import ChatMessageRenderer from "@/app/games/play/[gameId]/(components)/chat/message/chatMessageRenderer";
import ChatMessageEditor from "@/app/games/play/[gameId]/(components)/chat/message/chatMessageEditor";
import {useContextMenuSetter} from "@/app/(context)/contextMenuContext";
import {summarizeDiceLog} from "@/lib/supabase/util/diceLog";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import {
    authorName, findAuthor, formatDiscordTime, gameMembers, mentionToken, previewText
} from "@/app/games/play/[gameId]/(components)/chat/message/messageUtil";

type ChatMessageProps = {
    message: any;
    header: boolean;
    game: any;
    userId: string | undefined;
    channelName: string;
    canTalk: boolean;
    repliedMessage?: any;
    onReply: (message: any) => void;
};

// Rows from the database get a new updated_at on every change (trigger-owned), so id + updatedAt
// is enough to tell whether a message changed, even though the page re-creates message objects.
const sameMessage = (a: any, b: any) =>
    a === b || (!!a && !!b && a.id === b.id && a.updatedAt === b.updatedAt);

const propsEqual = (prev: ChatMessageProps, next: ChatMessageProps) =>
    prev.header === next.header
    && prev.game === next.game
    && prev.userId === next.userId
    && prev.channelName === next.channelName
    && prev.canTalk === next.canTalk
    && prev.onReply === next.onReply
    && sameMessage(prev.message, next.message)
    && sameMessage(prev.repliedMessage, next.repliedMessage);

export const ChatMessage = memo(function ChatMessage(
    {message, header, game, userId, channelName, canTalk, repliedMessage, onReply}: ChatMessageProps
) {
    const setContextMenu = useContextMenuSetter();

    const channels: string[] = Array.isArray(message.channel) ? message.channel : [message.channel];
    const author = findAuthor(game, message.playerId);
    const name = authorName(message, game);
    const isMentioned = !message.system && !!userId && !!message.messageText?.includes(mentionToken(userId));

    const members = useMemo(() => gameMembers(game), [game]);
    const dice = useMemo(() => summarizeDiceLog(message.log), [message.log]);
    const {created, shortTime, fullTime} = useMemo(() => {
        const created = message.createdAt ? new Date(message.createdAt) : null;
        return {
            created,
            shortTime: created ? created.toLocaleTimeString([], {hour: `numeric`, minute: `2-digit`}) : ``,
            fullTime: created ? formatDiscordTime(created) : ``,
        };
    }, [message.createdAt]);
    const avatarUrl = message.system ? null : author?.imageUrl;

    const isGm = game.gmUid === userId;
    const isCanon = channels.includes(`canon`);
    const isAuthor = !message.system && !!userId && message.playerId === userId;

    const [editing, setEditing] = useState(false);

    const toggleCanon = async () => {
        const next = isCanon ? channels.filter((c) => c !== `canon`) : [...channels, `canon`];
        await supabaseInGame.edit.message.channel(message.id, next);
    }
    const toggleLock = async () => {
        await supabaseInGame.edit.message.locked(message.id, !message.locked);
    }
    const togglePin = async () => {
        await supabaseInGame.edit.message.pinned(message.id, !message.isPinned);
    }
    const deleteMessage = async () => {
        await supabaseInGame.edit.message.delete(message.id);
    }

    const disableContextMenu = (e: any) => {
        e.preventDefault();
        // Open to the left of the cursor when the menu would run off the right edge
        const openLeft = e.clientX + 200 > window.innerWidth;
        const style = {
            top: `${e.clientY}px`,
            ...(openLeft ? {right: `${window.innerWidth - e.clientX}px`} : {left: `${e.clientX}px`})
        };
        const item = (key: string, label: string, onClick: () => void) =>
            <li className="btn btn-ghost btn-sm" onClick={onClick} key={key}>{label}</li>;

        // Removing canon from a message that is only in canon would leave it in no channel
        const canToggleCanon = isGm && (channelName === `turn`
            || (channelName === `canon` && channels.some((c) => c !== `canon`)));
        const canReply = canTalk && (channelName === `turn` || channelName === `open`);

        const options = [];
        // System messages only get canon toggle and delete
        if (!message.system && canReply) options.push(item(`reply`, `Reply`, () => onReply(message)));
        if (isAuthor && !message.locked) options.push(item(`edit`, `Edit Message`, () => setEditing(true)));
        if (canToggleCanon) options.push(item(`canon`, isCanon ? `Remove from Canon` : `Add to Canon`, toggleCanon));
        // GM and system messages are never locked, so only player messages get the option
        if (isGm && !message.system && message.playerId !== game.gmUid) {
            options.push(item(`lock`, message.locked ? `Unlock Message` : `Lock Message`, toggleLock));
        }
        if (isGm && !message.system) {
            options.push(item(`pin`, message.isPinned ? `Unpin Message` : `Pin Message`, togglePin));
        }
        if (isGm) options.push(item(`delete`, `Delete Message`, deleteMessage));
        if (options.length === 0) {
            options.push(<li className="btn btn-ghost btn-sm btn-disabled" key="no-options">No Options</li>)
        }
        setContextMenu({style, options, clicked: true});
    }

    return (
        <div className={`msg ${header ? `msg--header` : ``} ${isMentioned ? `msg--mention` : ``}`}
             onContextMenu={disableContextMenu} data-msg-id={message.id}>
            {message.replyTo && <ReplyPreview replied={repliedMessage} game={game}/>}
            <div className="msg__gutter">
                {header
                    ? avatarUrl
                        ? <img className="msg__avatar" src={avatarUrl} alt="" loading="lazy" decoding="async"/>
                        : <div
                            className={`msg__avatar msg__avatar--fallback ${message.system ? `bg-black text-white` : `bg-primary text-primary-content`}`}>
                            {name.charAt(0).toUpperCase()}
                        </div>
                    : <time className="msg__hover-time" title={fullTime}>{shortTime}</time>
                }
            </div>
            <div className="msg__content">
                {header &&
                  <div className="msg__header">
                    <span className="msg__name">{name}</span>
                      {message.system && <span className="msg__tag">SYSTEM</span>}
                    <time className="msg__time" title={created?.toLocaleString()}>{fullTime}</time>
                  </div>
                }
                {editing
                    ? <ChatMessageEditor message={message} game={game} onClose={() => setEditing(false)}/>
                    : <div className="msg__body">
                        <ChatMessageRenderer messageText={message.messageText} players={members}/>
                        {(message.editLog?.length ?? 0) > 1 && <span className="msg__edited">(edited)</span>}
                        {message.locked && <span className="msg__locked" title="Locked">🔒</span>}
                    </div>
                }
                {dice && (dice.error
                    ? <div className="msg__dice msg__dice--error">{dice.error}</div>
                    : <div className="msg__dice">
                        {dice.lines.map((line, i) => <div key={i}>{line}</div>)}
                        {dice.totals && <div className="msg__dice-totals">{dice.totals}</div>}
                    </div>)}
            </div>
        </div>
    )
}, propsEqual);

function ReplyPreview({replied, game}: { replied?: any, game: any }) {
    if (!replied || replied.deleted) {
        return <div className="reply reply--missing">Original message was deleted</div>;
    }

    const name = authorName(replied, game);
    const avatarUrl = replied.system ? null : findAuthor(game, replied.playerId)?.imageUrl;
    const created = replied.createdAt ? formatDiscordTime(new Date(replied.createdAt)) : ``;

    const jumpToOriginal = (e: any) => {
        e.currentTarget.closest(`.message-area`)
            ?.querySelector(`[data-msg-id="${replied.id}"]`)
            ?.scrollIntoView({behavior: `smooth`, block: `center`});
    }

    return (
        <div className="reply" onClick={jumpToOriginal}>
            {avatarUrl
                ? <img className="reply__avatar" src={avatarUrl} alt="" loading="lazy" decoding="async"/>
                : <span className="reply__avatar reply__avatar--fallback">{name.charAt(0).toUpperCase()}</span>}
            <span className="reply__name">{name}</span>
            <span className="reply__text">{previewText(replied, game)}</span>

            <div className="reply__popup">
                <div className="msg__header">
                    <span className="msg__name">{name}</span>
                    <time className="msg__time">{created}</time>
                </div>
                <div className="msg__body">
                    <ChatMessageRenderer messageText={replied.messageText} players={gameMembers(game)}/>
                </div>
            </div>
        </div>
    );
}
