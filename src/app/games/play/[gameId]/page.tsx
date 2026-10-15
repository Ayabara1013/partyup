'use client';

import '@/styles/games/play/play.scss';
import toast from "react-hot-toast";
import {use, useCallback, useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useAuthManager} from "@/app/(context)/authContext";

import {dirHref} from "@/lib/routing/directoy";
import {lsInGame} from "@/lib/util/localStorage";
import {supabase} from "@/lib/supabase/client/client";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import msgArrayManipulation from "@/lib/supabase/util/msgArrayManipulation";

import {useContextMenuSetter} from "@/app/(context)/contextMenuContext";

import {ChatWindow} from "@/app/games/play/[gameId]/(components)/chat/window/chatWindow";
import GMTools from "@/app/games/play/[gameId]/(components)/gmTools";
import PlayerSettingDisplay from "@/app/games/play/[gameId]/(components)/playerSettingsDisplay";
import CharacterForm, {CharacterSystem} from "@/app/games/play/[gameId]/(components)/character/characterForm";
import {useCharacterRoster} from "@/app/games/play/[gameId]/(components)/character/useCharacterRoster";
import {PlayerCardProvider} from "@/app/games/play/[gameId]/(components)/player/playerCard";
import {supabaseCharacter} from "@/lib/supabase/db/character";
import type {CharacterSheet} from "@/lib/assets/classes/characterSheet";

// Systems the character creator supports
const CHARACTER_SYSTEMS: CharacterSystem[] = [`dnd5e`, `pf2e`];

type PageProps = {
    params: Promise<{
        gameId: string;
    }>;
};

export default function PlayPage({params}: PageProps) {
    const {push} = useRouter();
    const {gameId} = use(params);
    const {user, userLoading, gmGames, playerGames, gamesLoading} = useAuthManager();
    const setContextMenu = useContextMenuSetter();

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

    // Characters: one living character per player; the GM sends dead ones to the grave and allows new ones
    const {roster, graveyard} = useCharacterRoster(gameObject?.id);
    const [creatorOpen, setCreatorOpen] = useState(false);
    const isGm = !!gameObject && gameObject.gmUid === user?.id;
    const mySeat = roster.find((entry) => entry.userId === user?.id);
    const canCreateCharacter = !!mySeat?.canCreateCharacter && !mySeat.character;
    const closeCreator = useCallback(() => setCreatorOpen(false), []);

    const createCharacter = async (sheet: CharacterSheet) => {
        if (!gameObject) return false;
        if (!await supabaseCharacter.set.create(gameObject.id, sheet)) return false;
        toast.success(`${sheet.name} is ready.`);
        setCreatorOpen(false);
        return true;
    };

    useEffect(() => {
        if (!userLoading && !gamesLoading) {
            if (userLoading) return;

            if (!user) {
                toast.error(`Please login and try again.`);
                const t = setTimeout(() => push(dirHref.user.signin), 1000);
                return () => clearTimeout(t);
            }

            if (gamesLoading) return;
            if (isPartOfGame(gmGames, gameId) || isPartOfGame(playerGames, gameId)) return;

            toast.error(`You are neither the GM nor a player of this game. Redirecting to your games.`);
            const t = setTimeout(() => push(dirHref.games.root), 1000);
            return () => clearTimeout(t);
        }
        // console.log({
        //     text: `/r 2 * (1d6+2[fire] + 2[fire, splash, 10ft]) + 1d6[bleed, persistent]`,
        //     result: messageParser.parseDice(`/r 2 * (1d6+2[fire] + 2[fire, splash, 10ft]) + 1d6[bleed, persistent]`)
        // })
        // console.log({
        //     text: `/r 2 * (1d6+2[fire] + 2[fire, splash, 10ft]) + 3 * (1d6+3[water] + 3[water, splash, 6ft])`,
        //     result: messageParser.parseDice(`/r 2 * (1d6+2[fire] + 2[fire, splash, 10ft]) + 3 * (1d6+3[water] + 3[water, splash, 6ft])`)
        // })
    }, [gmGames, playerGames, user, userLoading, gamesLoading]);

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

    function isPartOfGame(gameList: any[] | null, gameId: string) {
        const game = gameList?.find((g) => g.id === gameId);
        if (!game) return false;

        if (messages.length === 0) loadMessages();
        setGameObject((prev: any) => prev ?? game);
        return true;
    }
    async function loadMessages() {
        lsInGame.clear.legacy();
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

    // Drops this game's cached chat log and re-downloads every message from the database
    async function clearLocalMessages() {
        lsInGame.clear.chatLog(gameId);
        setMessages([]);
        await loadMessages();
        toast.success(`Cleared local messages and reloaded chat.`);
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
                <PlayerCardProvider game={gameObject} roster={roster} currentUserId={user?.id}>
                    <div className="chat-row relative flex flex-1 min-h-0 p-2 gap-2">
                        <ChatWindow {...chatWindowProps} name={'canon'}/>
                        <ChatWindow {...chatWindowProps} name={'turn'}/>
                        <ChatWindow {...chatWindowProps} name={'open'}/>

                        {/* Character creator: a popup over the Canon chat */}
                        {creatorOpen && canCreateCharacter &&
                          <div className="character-popup">
                              <CharacterForm system={gameObject.system} gameName={gameObject.name}
                                             playerName={user?.userMetadata?.name ?? ``}
                                             onClose={closeCreator} onSubmit={createCharacter}/>
                          </div>
                        }
                    </div>

                    <div className="tool-row flex shrink-0 p-2 pt-0 gap-2">
                        {gameObject.gmUid === user?.id
                            ? <GMTools game={gameObject} settings={settings} roster={roster} graveyard={graveyard}/>
                            : <PlayerSettingDisplay game={gameObject} settings={settings}/>
                        }
                        <section className='panel tool-row__element'>
                            <header className='panel__bar'>
                                <div className='panel__title'>
                                    <span className='panel__name'>Dev. Misc</span>
                                    <span className='panel__desc'>Dev stuff</span>
                                </div>
                            </header>
                            <div className='panel__body panel__actions'>
                                {!isGm && CHARACTER_SYSTEMS.includes(gameObject.system) &&
                                  <button className="panel-action" onClick={() => setCreatorOpen(true)} disabled={!canCreateCharacter}>
                                      <span className="panel-action__title">Create Character</span>
                                      <span className="panel-action__sub">
                                          {mySeat?.character
                                              ? `You're playing ${mySeat.character.name}. One character per game.`
                                              : canCreateCharacter
                                                  ? `Build your character sheet for this game.`
                                                  : `Ask your GM to allow a new character.`}
                                      </span>
                                  </button>
                                }
                                <button className="panel-action" onClick={clearLocalMessages}>
                                    <span className="panel-action__title">Clear Local Messages</span>
                                    <span className="panel-action__sub">Messages are cached in your browser. Clear them to re-download this game&apos;s chat.</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </PlayerCardProvider> :
                <div className={`flex justify-center`}>
                    <span className={`loading loading-infinity loading-lg`}/>
                </div>
            }
        </div>
    )
}