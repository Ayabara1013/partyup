'use client';

import { createContext, useContext, useEffect, useState } from "react";

const PlayContext = createContext(null);

export function PlayProvider({ children }) {

  const [windowState, setWindowState] = useState([false, true, false]);

  useEffect(() => {
    console.log(windowState);
  }, [windowState])

  return (
    <PlayContext.Provider value={{
      windowState, setWindowState,

    }}>
      {children}
    </PlayContext.Provider>
  )
}

export function usePlayContext() {
  const context = useContext(PlayContext);
  if (!context) {
    throw new Error('usePlayContext must be used within an PlayProvider');
  }
  return context;
}