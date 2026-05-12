import MessageRenderer from "@/app/games/play/[gameId]/(components)/chat/messageRenderer";
import {useAuthManager} from "@/app/(context)/authContext";
import {useContextMenu} from "@/app/(context)/contextMenuContext";

export function ChatMessage({message, game}: { message: any, game: any }) {
    const {user} = useAuthManager();
    const {setContextMenu} = useContextMenu();
    const name = message.system ? `System` : message.userId;
    // @ts-ignore
    const color = message.messageText.indexOf(`@${user.name}`) !== -1 ? `chat-bubble-accent` : `chat-bubble-primary`

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
        if (message.channel === 'open') {
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
              <div className="chat-header">
                  {name}
                <time className="text-xs opacity-50"></time>
              </div>
            }
            <div className={`chat-bubble ${color} w-full`} onContextMenu={disableContextMenu}>
                <MessageRenderer messageText={message.messageText} players={game.players}/>
            </div>
        </div>
    )
}