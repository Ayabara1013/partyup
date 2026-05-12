'use client'

import '@/styles/games/play/chatWindow.scss';
import {useEffect, useRef} from "react";
import msgArrayManipulation from "@/lib/supabase/util/msgArrayManipulation";
import {ChatMessage} from "@/app/games/play/[gameId]/(components)/chat/chatMessage";
import {useAuthManager} from "@/app/(context)/authContext";
import ChatInput from "@/app/games/play/[gameId]/(components)/chat/chatInput";

export function ChatWindow(
    {messages, game, settings, name}: { messages: Array<any>, game: any, settings: any, name: string }
) {
    const windowEnd = useRef(null);
    const {user} = useAuthManager();

    useEffect(() => {
        if (windowEnd.current) {
            // @ts-ignore
            windowEnd.current.scrollIntoView({behavior: 'smooth', block: 'start'});
        }
    }, [messages])

    function toggleActive(e: any) {
        e.target.parentElement.classList.toggle('--active');
        e.target.parentElement.classList.toggle('--inactive');
    }

    const disableContextMenu = (e: any) => {
        e.preventDefault();
    }

    function messageElements() {
        let outputMessages = [];
        for (let i = 0; i < messages.length; i++) {
            let message = messages[i];

            //check if previous message was by current player to display header name/icon. Displays for very first message.
            if (message.channel === name && !message.deleted) {
                let pushedMessage = structuredClone(message);
                pushedMessage.header = i === 0 || (outputMessages[outputMessages.length - 1]?.playerId !== pushedMessage.playerId)
                outputMessages.push(pushedMessage);
            }
        }
        msgArrayManipulation.sortByCreated(outputMessages);
        return outputMessages.map((message, i) => {
            return <ChatMessage key={i} {...{message, game}}/>
        })
    }

    function showInput() {
        if (game.gmUid === user?.id
            || (name === `turn` && (settings.talkingStick === user?.id || settings.rollingStick === user?.id))
            || name === `open` && !settings.openMute[user?.id ?? ''])
            return ``
        return `hidden`
    }

    return (
        <div className={`--active chat-window flex flex-col gap-2 h-full min-h-0 `}
             onContextMenu={disableContextMenu}>
            <div className={`chat-window__header uppercase full-element-btn`} onClick={toggleActive}>
                <p>{name}</p>
            </div>

            <div className={`message-area flex-col flex-auto h-full overflow-y-auto`}>
                {messageElements()}
                <div ref={windowEnd}/>
            </div>
            <ChatInput className={`input input-bordered input-primary w-full ${showInput()}`} name={name}
                       game={game}/>
        </div>)
}
