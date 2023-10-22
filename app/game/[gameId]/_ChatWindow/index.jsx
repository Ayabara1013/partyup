import { sortByKey } from "@/util/functions";

import { ui } from "@/util/ui";
import { messaging } from "@/firebase/messaging";
import ChatMessage from "@/app/game/[gameId]/_ChatWindow/_ChatMessage";

export default function ChatWindow({ window, gameItems }) {
    let { game, messages, members } = gameItems
    let canon = (window === 'canon');
    const generateMessages = (preFilterMessages) => {
        let messages = filterMessages(preFilterMessages);
        let finalChat = [];
        for (let i = 0; i < messages.length; i++) {
            let msg = messages[i];
            msg.type = [];
            //check if last consecutive msg by a player to display name, also will do for first msg in the log.
            if (i !== 0) {
                let prevMsg = messages[i - 1];
                if (prevMsg.uid !== msg.uid) {
                    msg.type.push('header');
                }
            } else {
                msg.type.push('header');
            }
            if (i === messages.length - 1) {
                msg.type.push('icon');
                finalChat.push(msg);
                break;
            }
            //check if last consecutive msg by a player to display icon.
            let nextMsg = messages[i + 1];
            if (nextMsg.uid !== msg.uid) {
                msg.type.push('icon');
            }
            finalChat.push(msg);
        }
        return finalChat.map(msg =>
            <ChatMessage key={ `${ window }-${ msg.id }` } game={ game } message={ msg } members={ members }/>);
    }
    const filterMessages = () => {
        let newMessageList = [];
        if (messages) {
            for (let msg of messages) {
                (msg.window === window) && newMessageList.push(structuredClone(msg));
                if (window === 'canon') {
                    (msg.window === 'init' && msg.canon === true) && newMessageList.push(structuredClone(msg));
                }
            }
            sortByKey(newMessageList, 'createdAt');

            return newMessageList;
        }

        return <></>
    }

    const textOnKeyUp = async (e) => {
        if ((e.key === 'Enter' || e.keyCode === 13) && !e.shiftKey) {
            let newMessage = e.target.value.trim();
            if(newMessage !== ''){
                checkChatCommands(newMessage)
                await messaging.game.addMessage(game, window, newMessage, []);
                e.target.value = '';
            }
        }
    }

    const checkChatCommands = (text) => {
        let args = text.split(' ');
        if(args.length > 0) {
            let cmd = args[0][0] + args[0][1]
            switch(cmd) {
                case '!r':
                    if(args[1])
                        break;
                default:
                    break;
            }
        }
    }

    return (
        <div className="border flex flex-col">
            <div className={ `chat-box ${ (canon) && 'h-full' }` }>
                { generateMessages() }
                <span id={ ui.messaging[window].id }/>
            </div>
            { !canon && <textarea className="textarea w-full flex-1" onKeyUp={ textOnKeyUp }/> }
        </div>
    )
}