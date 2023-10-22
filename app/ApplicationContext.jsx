'use client';
import { useAuthState } from "react-firebase-hooks/auth";
import { createContext, useContext, useEffect, useState } from 'react';

import ContextMenuBase from "@/components/ContextMenu/ContextMenuBase";

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { fbManagement } from "@/firebase/fbManagement";

const ApplicationContext = createContext(null);

export function Application({children}) {
    const [user] = useAuthState(userAuth);
    const [updateOn, setUpdateOn] = useState(false);
    const [contextMenu, setContextMenu] = useState({clicked: false});
    const [activeGames, setActiveGames] = useState(null);


    useEffect(() => {
        const handleClick = () => {
            setContextMenu({clicked: false});
        }
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        }
    }, [])

    useEffect(() => {
        ui.mainLayout.loginButton.element().classList[(user) ? 'add' : 'remove']('hidden');
        ui.mainLayout.logoutButton.element().classList[(!user) ? 'add' : 'remove']('hidden');
        if (user) {
            setGames();
        }
    }, [user]);

    useEffect(() => {
        if (user && !updateOn) {
            fbManagement.live.userIsDmGames(updateDmGames);
            fbManagement.live.userIsPlayerGames(updatePlayerGames);
            setUpdateOn(true);
        }
    }, [activeGames]);
    const setGames = async () => {
        if (user) {
            let dmGames = await fbManagement.get.userIsDmGames() || [];
            let playerGames = await fbManagement.get.userIsPlayerGames() || [];
            let length = dmGames.length + playerGames.length || 0;
            for (let game of dmGames) {
                game.unsub = await fbManagement.live.memberJoined(game, updateDmGames);
            }
            let games = {dmGames, playerGames, length}
            setActiveGames(games);
        }
    }
    const updateDmGames = async (dmGames) => {
        if (user) {
            if (activeGames) {
                for (let game of activeGames.dmGames) {
                    game.unsub();
                }
            }
            let playerGames = (activeGames) ? activeGames.playerGames : [];
            let length = dmGames.length + playerGames.length || 0;
            for (let game of dmGames) {
                game.unsub = await fbManagement.live.memberJoined(game, updateDmGames);
            }
            setActiveGames({dmGames, playerGames, length});
        }
    }
    const updatePlayerGames = async (playerGames) => {
        if (user) {
            let dmGames = (activeGames) ? activeGames.dmGames : [];
            let length = dmGames.length + playerGames.length || 0;
            setActiveGames({dmGames, playerGames, length});
        }
    }

    return (
        <ApplicationContext.Provider value={{
            user,
            activeGames, setActiveGames,
            contextMenu, setContextMenu
        }}>
            {children}
            {contextMenu.clicked && <ContextMenuBase style={contextMenu.style} menuOptions={contextMenu.menuOptions}/>}
        </ApplicationContext.Provider>
    )
}

export function useApplicationContext() {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error('useApplicationContext must be used within an ApplicationContextProvider');
    }
    return context;
}