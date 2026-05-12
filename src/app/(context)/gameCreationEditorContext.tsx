'use client';
import {createContext, ReactNode, useContext, useRef} from 'react';
import {safetyChecks} from "@/lib/assets/safetyChecks";

type BaseGameContextType = {
    gameInfoRefs: any,
    safetyChecksList: Array<any>,
    getFormData: () => any
}
const GameManagerContext = createContext<BaseGameContextType | null>(null);

export function GameManagerProvider({children}: { children: ReactNode }) {
    const gameInfoRefs = {
        descRef: useRef<HTMLInputElement | null>(null),
        gameNameRef: useRef<HTMLInputElement | null>(null),
        systemRef: useRef<HTMLSelectElement | null>(null),
        maxPlayersRef: useRef<HTMLInputElement | null>(null),
        ageResRef: useRef<HTMLInputElement | null>(null),
        sc0Ref: useRef<HTMLInputElement | null>(null),
        sc1Ref: useRef<HTMLInputElement | null>(null),
        sc2Ref: useRef<HTMLInputElement | null>(null),
        sc3Ref: useRef<HTMLInputElement | null>(null),
        tagsRef: useRef<HTMLInputElement | null>(null),
        publicGameRef: useRef<HTMLInputElement | null>(null),
    }
    const safetyChecksList = safetyChecks.checkListArray([
        gameInfoRefs.sc0Ref, gameInfoRefs.sc1Ref, gameInfoRefs.sc2Ref, gameInfoRefs.sc3Ref
    ])
    function getFormData() {
        let tags = gameInfoRefs.tagsRef.current!.value.split(',');
        let playerMax = parseInt(gameInfoRefs.maxPlayersRef.current!.value);
        if (playerMax < 2) {
            playerMax = 2;
        } else if (playerMax > 4) {
            playerMax = 4;
        }
        return {
            name: gameInfoRefs.gameNameRef.current!.value.trim(),
            // gm: cleanUserData(userDetails),
            description: gameInfoRefs.descRef.current!.value,
            system: gameInfoRefs.systemRef.current!.value,
            maxPlayers: playerMax,
            ageRes: parseInt(gameInfoRefs.ageResRef.current!.value),
            sc0: gameInfoRefs.sc0Ref.current!.checked,
            sc1: gameInfoRefs.sc1Ref.current!.checked,
            sc2: gameInfoRefs.sc2Ref.current!.checked,
            sc3: gameInfoRefs.sc3Ref.current!.checked,
            tags,
            isPublic: gameInfoRefs.publicGameRef.current!.checked,
        }
    }

    return (
        <GameManagerContext.Provider value={{gameInfoRefs, safetyChecksList, getFormData}}>
            {children}
        </GameManagerContext.Provider>
    )
}

export function useGameManager() {
    const context = useContext(GameManagerContext);
    if (!context) {
        throw new Error('useGameManager must be used within a GameManagerProvider');
    }
    return context;
}