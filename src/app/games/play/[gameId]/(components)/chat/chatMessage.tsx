import MessageRenderer from "@/app/games/play/[gameId]/(components)/chat/messageRenderer";
import {useAuthManager} from "@/app/(context)/authContext";
import {useContextMenu} from "@/app/(context)/contextMenuContext";

export function ChatMessage({message, game}: { message: any, game: any }) {
    const {user} = useAuthManager();
    const {setContextMenu} = useContextMenu();

    const channels: string[] = Array.isArray(message.channel) ? message.channel : [message.channel];
    const author = [game.gm, ...(game.players ?? [])].find((p: any) => p?.id === message.playerId);
    const name = message.system ? `System` : author?.name ?? `Unknown player`;
    // @ts-ignore
    const isMentioned = !message.system && !!user?.name && message.messageText?.includes(`@${user.name}`);

    const color = message.system
        ? `bg-black text-white`
        : isMentioned ? `chat-bubble-accent` : `chat-bubble-primary`;

    const time = message.createdAt
        ? new Date(message.createdAt).toLocaleTimeString([], {hour: `numeric`, minute: `2-digit`})
        : ``;
    const toggleCanon = async () => {
        //await fbInGameManager.setting.gm.chatContextOption.toggleCanon(game.id, message.id, !message.canon);
    }
    const deleteMessage = async () => {
        // await fbInGameManager.setting.gm.chatContextOption.deleteMessage(game.id, message.id,);
    }

    const disableContextMenu = (e: any) => {
        e.preventDefault();
        let x = e.clientX, y = e.clientY, right = (e.clientX + 200 > window.innerWidth);
        right && (x = window.innerWidth - x);
        let style = {
            top: `${y}px`,
            ...right && {right: `${x}px`},
            ...!right && {left: `${x}px`}
        }
        let options = []
        if (message.channel.includes('open')) {
        } else {
            if (game.gmUid === user?.id && !message.system) {
                options.push(<li className="text-center btn btn-xs" onClick={toggleCanon} key={1}>Toggle Cannon</li>)
                options.push(<li className="text-center btn btn-xs" onClick={deleteMessage} key={2}>Delete Message</li>)
            }
        }
        if (options.length === 0) {
            options.push(<li key="no-options">
                <button className="btn btn-xs" disabled>No Options</button>
            </li>)
        }
        setContextMenu({style, options, clicked: true});
    }
    return (
        <div className={`custom-chat `}>
            {message.header &&
              <div className="chat-header flex items-center gap-2">
                <span className={message.system ? `px-1.5 rounded bg-black text-white text-xs font-semibold` : ``}>
                    {name}
                </span>
                <time className="text-xs opacity-50">{time}</time>
              </div>
            }
            <div className={`chat-bubble ${color} w-full`} onContextMenu={disableContextMenu}>
                <MessageRenderer messageText={message.messageText} players={game.players}/>
            </div>
        </div>
    )
}