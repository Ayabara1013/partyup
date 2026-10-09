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
        const channelMessages = messages
            .filter((m) => m.channel.includes(name) && !m.deleted)
            .map((m) => ({...m}));
        msgArrayManipulation.sortByCreated(channelMessages);
        channelMessages.forEach((m, i) => {
            const prev = channelMessages[i - 1];
            m.header = i === 0 || prev.playerId !== m.playerId || !!prev.system !== !!m.system;
        });
        return channelMessages.map((message, i) => {
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
