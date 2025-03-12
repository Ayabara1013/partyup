'use client';
import { createContext, useContext, useEffect, useState } from "react";
import ContextMenuBase from "@components/ContextMenu/contextMenuBase";

const ContextMenuContext = createContext(null);

export function ContextMenuProvider({ children }) {
  const [ contextMenu, setContextMenu ] = useState({ clicked: false });

  useEffect(() => {
    const handleClick = () => {
      setContextMenu({ clicked: false });
    }
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    }
  }, [])

  return (
    <ContextMenuContext.Provider value={{ contextMenu, setContextMenu }}>
      <ContextMenuBase/>
      {children}
    </ContextMenuContext.Provider>
  );
}

export function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error('useApplicationContext must be used within an ApplicationContextProvider');
  }
  return context;
}