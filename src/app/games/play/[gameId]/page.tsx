'use client';

import '@/styles/games/play/play.scss';
import toast from "react-hot-toast";
import {use, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthManager} from "@/app/(context)/authContext";

import {dirHref} from "@/lib/routing/directoy";
import {lsInGame} from "@/lib/util/localStorage";
import {supabase} from "@/lib/supabase/client/client";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import msgArrayManipulation from "@/lib/supabase/util/msgArrayManipulation";

import {useContextMenu} from "@/app/(context)/contextMenuContext";

import {ChatWindow} from "@/app/games/play/[gameId]/(components)/chat/chatWindow";
import GMTools from "@/app/games/play/[gameId]/(components)/GMTools";
import PlayerSettingDisplay from "@/app/games/play/[gameId]/(components)/PlayerSettingsDisplay";
import messageParser from "@/lib/supabase/util/messageParser";

type PageProps = {
    params: Promise<{
        gameId: string;
    }>;
};

export default function page({params}: PageProps) {
    const {push} = useRouter();
    const {gameId} = use(params);
    const {user, loading, gmGames, playerGames} = useAuthManager();
    const {setContextMenu} = useContextMenu();

    const [messages, setMessages] = useState<Array<any>>([]);
    const [settings, setSettings] = useState({
        loaded: false,
        rollingStick: '',
        talkingStick: '',
        openMute: null
    });
    const [gameObject, setGameObject] = useState<any>(null);
    const [players, setPlayers] = useState({hasPlayers: false});
    const chatWindowProps = {messages, game: gameObject, user: user, players, settings, setContextMenu}

    useEffect(() => {
        if (!loading) {
            if (isPartOfGame(gmGames, gameId)) return;
            if (isPartOfGame(playerGames, gameId)) return;
            if (!user) {
                toast.error("Please login and try again.");
                setTimeout(() => {
                    push(dirHref.user.signin)
                }, 1000)
            }
            if (gmGames && playerGames) {
                toast.error(`You are neither the GM nor a player of this game. Redirecting to your games.`);
                setTimeout(() => {
                    push(dirHref.games.root)
                }, 1000)
            }
        }
        // console.log({
        //     text: `/r 2 * (1d6+2[fire] + 2[fire, splash, 10ft]) + 1d6[bleed, persistent]`,
        //     result: messageParser.parseDice(`/r 2 * (1d6+2[fire] + 2[fire, splash, 10ft]) + 1d6[bleed, persistent]`)
        // })
        // console.log({
        //     text: `/r 2 * (1d6+2[fire] + 2[fire, splash, 10ft]) + 3 * (1d6+3[water] + 3[water, splash, 6ft])`,
        //     result: messageParser.parseDice(`/r 2 * (1d6+2[fire] + 2[fire, splash, 10ft]) + 3 * (1d6+3[water] + 3[water, splash, 6ft])`)
        // })
    }, [gmGames, playerGames, user, loading])

    useEffect(() => {
        if (gameObject) {
            supabaseInGame.get.settings(gameId).then(data => {
                setSettings(data)
            })
            const settingsChannel = supabaseInGame.live.settings(gameObject.id, setSettings);
            const messagesChannel = supabaseInGame.live.messages(gameObject.id, updateMessages);

            return () => {
                supabase.removeChannel(settingsChannel);
                supabase.removeChannel(messagesChannel);
            }
        }
    }, [gameObject])



    useEffect(() => {
        if (settings.loaded && gameObject && user) {
            let oldSettings = lsInGame.get.settings(gameObject.id);
            if (oldSettings.talkingStick === user.id && settings.talkingStick !== user.id) toast(`It is no longer your turn.`)
            if (oldSettings.talkingStick !== user.id && settings.talkingStick === user.id) toast(`It is your turn.`)
            lsInGame.set.settings(gameObject.id, settings)
        }
    }, [settings]);
    useEffect(() => {
    }, [messages]);

    function isPartOfGame(gameList: Array<any> | null, gameId: string) {
        if (gameList) {
            for (let game of gameList) {
                if (gameId === game.id) {
                    if (messages.length === 0) loadMessages();
                    if (!gameObject) {
                        setGameObject(game);
                    }
                    return true;
                }
            }
        }
        return false;
    }

    async function loadMessages() {
        let tempMessages = lsInGame.get.chatLog(gameId);
        if (tempMessages.length === 0) {
            tempMessages = await supabaseInGame.get.allMessages(gameId);
        } else {
            msgArrayManipulation.sortByUpdated(tempMessages);
            let lastUpdated = tempMessages[tempMessages.length - 1].updatedAt;
            let newMessages = await supabaseInGame.get.allMessagesAfterDate(gameId, new Date(lastUpdated).toISOString());
            msgArrayManipulation.combineReplaceOnKey(tempMessages, newMessages, `id`);
        }
        lsInGame.set.chatLog(gameId, tempMessages);
        setMessages(tempMessages);
    }

    async function updateMessages(newMessages: Array<any> = []) {
        let tempMessages = [...lsInGame.get.chatLog(gameId)];
        msgArrayManipulation.combineReplaceOnKey(tempMessages, newMessages, `id`);
        msgArrayManipulation.sortByCreated(tempMessages);
        console.log(`tempMessages`, tempMessages)
        lsInGame.set.chatLog(gameId, tempMessages);
        setMessages(tempMessages);
    }

    return (
        <div className="flex flex-col flex-1 min-h-0 h-full">
            {settings.loaded ?
                <>
                    <div className="chat-row flex flex-1 min-h-0 p-2 gap-2">
                        <ChatWindow {...chatWindowProps} name={'canon'}/>
                        <ChatWindow {...chatWindowProps} name={'turn'}/>
                        <ChatWindow {...chatWindowProps} name={'open'}/>
                    </div>

                    <div className="tool-row flex shrink-0 p-2 gap-4">
                        {gameObject.gmUid === user?.id
                            ? <GMTools game={gameObject} settings={settings}/>
                            : <PlayerSettingDisplay game={gameObject} settings={settings}/>
                        }
                        <div className='tool-row__element'>
                        </div>
                    </div>
                </> :
                <div className={`flex justify-center`}>
                    <span className={`loading loading-infinity loading-lg`}/>
                </div>
            }
        </div>
    )
}