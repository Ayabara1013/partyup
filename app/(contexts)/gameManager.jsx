'use client';
import {createContext, useContext, useRef} from 'react';

const GameManagerContext = createContext(null);

export function GameManagerProvider({children}) {
  const gameInfoRefs = {
    descRef: useRef(null),
    gameNameRef: useRef(null),
    systemRef: useRef(null),
    maxPlayersRef: useRef(null),
    sc0Ref: useRef(null),
    sc1Ref: useRef(null),
    sc2Ref: useRef(null),
    sc3Ref: useRef(null),
    tagsRef: useRef(null),
    publicGameRef: useRef(null),
  }
  const safetyChecks = [
    {label: 'Queer', ref: gameInfoRefs.sc0Ref, checked: false},
    {label: 'SA', ref: gameInfoRefs.sc1Ref, checked: false},
    {label: 'Trigger Warnings', ref: gameInfoRefs.sc2Ref, checked: false},
    {label: 'RYG Light', ref: gameInfoRefs.sc3Ref, checked: false},
  ];

  function getFormData(userDetails) {
    let tags = gameInfoRefs.tagsRef.current.value.split(',');
    return {
      name: gameInfoRefs.gameNameRef.current.value.trim(),
      uid: userDetails.id,
      uName: userDetails.uName,
      desc:gameInfoRefs.descRef.current.value,
      system: gameInfoRefs.systemRef.current.value,
      maxPlayers: gameInfoRefs.maxPlayersRef.current.value,
      sc0: gameInfoRefs.sc0Ref.current.checked,
      sc1: gameInfoRefs.sc1Ref.current.checked,
      sc2: gameInfoRefs.sc2Ref.current.checked,
      sc3: gameInfoRefs.sc3Ref.current.checked,
      tags,
      isPublic: gameInfoRefs.publicGameRef.current.checked,
    }
  }

  return (
    <GameManagerContext.Provider value={{gameInfoRefs, safetyChecks, getFormData}}>
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