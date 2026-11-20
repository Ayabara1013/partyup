'use client';

import '@/styles/games/play/play.scss';
import toast from "react-hot-toast";
import {type ComponentProps, use, useCallback, useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {useRouter} from "next/navigation";
import {useAuthManager} from "@/app/(context)/authContext";

import {dirHref} from "@/lib/routing/directoy";
import {lsInGame} from "@/lib/util/localStorage";
import {supabase} from "@/lib/supabase/client/client";
import {supabaseInGame} from "@/lib/supabase/db/inGame";

import {ChatWindow} from "@/app/games/play/[gameId]/(components)/chat/window/chatWindow";
import {useGameMessages} from "@/app/games/play/[gameId]/(components)/chat/useGameMessages";
import GMTools from "@/app/games/play/[gameId]/(components)/gmTools";
import PlayerSettingDisplay from "@/app/games/play/[gameId]/(components)/playerSettingsDisplay";
import type CharacterFormComponent from "@/app/games/play/[gameId]/(components)/character/characterForm";
import type {CharacterSystem} from "@/app/games/play/[gameId]/(components)/character/characterForm";
import {useCharacterRoster} from "@/app/games/play/[gameId]/(components)/character/useCharacterRoster";
import {PlayerCardProvider} from "@/app/games/play/[gameId]/(components)/player/playerCard";
import {supabaseCharacter} from "@/lib/supabase/db/character";
import type {CharacterSheet} from "@/lib/assets/classes/characterSheet";

// Systems the character creator supports
const CHARACTER_SYSTEMS: CharacterSystem[] = [`dnd5e`, `pf2e`];

// The character creator is downloaded only when it is opened, or about to be (its button hovered or focused)
const loadCharacterForm = () => import("@/app/games/play/[gameId]/(components)/character/characterForm");
const CharacterForm = dynamic<ComponentProps<typeof CharacterFormComponent>>(
    () => loadCharacterForm().catch(() => CreatorUnavailable), {ssr: false});
const preloadCharacterForm = () => {
    loadCharacterForm().catch(() => {}); // opening the creator reports a failure
};

// A failed download: say so and close the popup instead of breaking the page
function CreatorUnavailable({onClose}: { onClose: () => void }) {
    useEffect(() => {
        toast.error(`Could not load the character creator. Check your connection and reload the page.`, {id: `creator-load`});
        onClose();
    }, [onClose]);
    return null;
}

type PageProps = {
    params: Promise<{
        gameId: string;
    }>;
};

export default function PlayPage({params}: PageProps) {
    const {push} = useRouter();
    const {gameId} = use(params);
    const {user, userLoading, gmGames, playerGames, gamesLoading} = useAuthManager();

    const [settings, setSettings] = useState({
        loaded: false,
        rollingStick: '',
        talkingStick: '',
        openMute: null
    });
    // A failed settings fetch keeps the loading screen, with a retry instead of the spinner
    const [settingsFailed, setSettingsFailed] = useState(false);
    const [settingsAttempt, setSettingsAttempt] = useState(0);
    const [gameObject, setGameObject] = useState<any>(null);

    // The chat: loaded once the visitor is confirmed as the GM or a player of this game
    const {messages, messagesById, reload} = useGameMessages(gameId, !!gameObject);
    // The GM's "Show deleted messages" switch (GM Tools): off each time the page opens, never on for a player
    const [showDeleted, setShowDeleted] = useState(false);
    const chatWindowProps = {
        messages, messagesById, game: gameObject, settings, userId: user?.id,
        showDeleted: showDeleted && !!gameObject && gameObject.gmUid === user?.id,
    };

    // Characters: one living character per player; the GM sends dead ones to the grave and allows new ones
    const isGm = !!gameObject && gameObject.gmUid === user?.id;
    const {roster, graveyard} = useCharacterRoster(gameObject?.id, isGm); // only the GM's panel shows the graveyard
    const [creatorOpen, setCreatorOpen] = useState(false);
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

            if (!user) return; // signed out: the auth context sends them to the login page

            if (gamesLoading) return;
            if (isPartOfGame(gmGames, gameId) || isPartOfGame(playerGames, gameId)) return;

            toast.error(`You are neither the GM nor a player of this game. Redirecting to your games.`);
            const t = setTimeout(() => push(dirHref.games.root), 1000);
            return () => clearTimeout(t);
        }
    }, [gmGames, playerGames, user, userLoading, gamesLoading]);

    useEffect(() => {
        if (gameObject) {
            let latest = true; // false once a retry (or leaving) replaces this attempt
            supabaseInGame.get.settings(gameObject.id).then(data => {
                if (!latest) return;
                if (data) {
                    setSettings(data);
                } else {
                    toast.error(`Could not load the game settings.`);
                    setSettingsFailed(true);
                }
            })
            const settingsChannel = supabaseInGame.live.settings(gameObject.id, setSettings);

            return () => {
                latest = false;
                supabase.removeChannel(settingsChannel);
            }
        }
    }, [gameObject, settingsAttempt])

    const retrySettings = () => {
        setSettingsFailed(false);
        setSettingsAttempt((n) => n + 1);
    };


    useEffect(() => {
        if (settings.loaded && gameObject && user) {
            let oldSettings = lsInGame.get.settings(gameObject.id);
            if (oldSettings.talkingStick === user.id && settings.talkingStick !== user.id) toast(`It is no longer your turn.`)
            if (oldSettings.talkingStick !== user.id && settings.talkingStick === user.id) toast(`It is your turn.`)
            lsInGame.set.settings(gameObject.id, settings)
        }
    }, [settings]);

    function isPartOfGame(gameList: any[] | null, gameId: string) {
        const game = gameList?.find((g) => g.id === gameId);
        if (!game) return false;

        setGameObject((prev: any) => prev ?? game);
        return true;
    }

    // Drops this game's cached chat log and re-downloads every message from the database
    async function clearLocalMessages() {
        await reload();
        toast.success(`Cleared local messages and reloaded chat.`);
    }

    return (
        <div className="flex flex-col flex-1 min-h-0 h-full">
            {settings.loaded ?
                <PlayerCardProvider game={gameObject} roster={roster} currentUserId={user?.id}>
                    <div className="chat-row relative flex flex-1 min-h-0 p-2 gap-2">
                        <ChatWindow {...chatWindowProps} name={'canon'}/>
                        <ChatWindow {...chatWindowProps} name={'turn'}/>
                        <ChatWindow {...chatWindowProps} name={'open'}/>

                        {/* Character creator: a popup over the Canon chat (nothing shows while it downloads) */}
                        {creatorOpen && canCreateCharacter &&
                          <CharacterForm system={gameObject.system} gameName={gameObject.name}
                                         playerName={user?.userMetadata?.name ?? ``}
                                         onClose={closeCreator} onSubmit={createCharacter}/>
                        }
                    </div>

                    <div className="tool-row flex shrink-0 p-2 pt-0 gap-2">
                        {gameObject.gmUid === user?.id
                            ? <GMTools game={gameObject} settings={settings} roster={roster} graveyard={graveyard}
                                       showDeleted={showDeleted} onShowDeletedChange={setShowDeleted}/>
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
                                  <button className="panel-action soft-card" onClick={() => setCreatorOpen(true)} disabled={!canCreateCharacter}
                                          onPointerEnter={canCreateCharacter ? preloadCharacterForm : undefined}
                                          onFocus={canCreateCharacter ? preloadCharacterForm : undefined}>
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
                                <button className="panel-action soft-card" onClick={clearLocalMessages}>
                                    <span className="panel-action__title">Clear Local Messages</span>
                                    <span className="panel-action__sub">Messages are cached in your browser. Clear them to re-download this game&apos;s chat.</span>
                                </button>
                            </div>
                        </section>
                    </div>
                </PlayerCardProvider> :
                <div className={`flex justify-center`}>
                    {settingsFailed
                        ? <button className={`btn btn-sm`} onClick={retrySettings}>Retry loading the game</button>
                        : <span className={`loading loading-infinity loading-lg`}/>}
                </div>
            }
        </div>
    )
}