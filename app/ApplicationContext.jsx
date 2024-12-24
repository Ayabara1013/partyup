'use client';
import { useAuthState } from "react-firebase-hooks/auth";
import { createContext, useContext, useEffect, useState } from 'react';

import ContextMenuBase from "@/components/ContextMenu/ContextMenuBase";

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { fbManagement } from "@/firebase/fbManagement";
import { usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import { validate } from 'email-validator';

const ApplicationContext = createContext(null);

export function Application({ children }) {
  const [ user ] = useAuthState(userAuth);
  const [ updateOn, setUpdateOn ] = useState(false);
  const [ contextMenu, setContextMenu ] = useState({ clicked: false });
  const [ activeGames, setActiveGames ] = useState(null);
  const [ temp, setTemp ] = useState({
    user: usersCollection.user1,
    userTotalGames: 3,
    freeAllowedGames: 1,
    isUserPremium: false,
  });



  useEffect(() => {
    const handleClick = () => {
      setContextMenu({ clicked: false });
    }
    window.addEventListener('click', handleClick);
    return () => {
      window.removeEventListener('click', handleClick);
    }
  }, [])

  // useEffect(() => {
  //   ui.mainLayout.loginButton.element().classList[(user) ? 'add' : 'remove']('hidden');
  //   ui.mainLayout.logoutButton.element().classList[(!user) ? 'add' : 'remove']('hidden');
  //   if (user) {
  //     setGames();
  //   }
  // }, [ user ]);
  // // recieved error >> TypeError: Cannot read properties of null (reading 'classList')

  useEffect(() => {
    if (ui.mainLayout.loginButton.element()) {
      ui.mainLayout.loginButton.element().classList[(user) ? 'add' : 'remove']('hidden');
    }
    if (ui.mainLayout.logoutButton.element()) {
      ui.mainLayout.logoutButton.element().classList[(!user) ? 'add' : 'remove']('hidden');
    }
    if (user) {
      setGames();
    }
  }, [user]);

  // useEffect(() => {
  //   if (user && !updateOn) {
  //     fbManagement.live.userIsDmGames(updateDmGames);
  //     fbManagement.live.userIsPlayerGames(updatePlayerGames);
  //     setUpdateOn(true);
  //   }
  // }, [activeGames]);

  useEffect(() => {
    if (user && !updateOn) {
      fbManagement.live.userIsDmGames(updateDmGames);
      fbManagement.live.userIsPlayerGames(updatePlayerGames);
      setUpdateOn(true);
    }
  }, [user]);  // Only trigger when user changes, not on every activeGames change
  
  

  const setGames = async () => {
    if (user) {
      let dmGames = await fbManagement.get.userIsDmGames() || [];
      let playerGames = await fbManagement.get.userIsPlayerGames() || [];
      let length = dmGames.length + playerGames.length || 0;
      for (let game of dmGames) {
        game.unsub = await fbManagement.live.memberJoined(game, updateDmGames);
      }
      let games = { dmGames, playerGames, length }
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
      setActiveGames({ dmGames, playerGames, length });
    }
  }
  const updatePlayerGames = async (playerGames) => {
    if (user) {
      let dmGames = (activeGames) ? activeGames.dmGames : [];
      let length = dmGames.length + playerGames.length || 0;
      setActiveGames({ dmGames, playerGames, length });
    }
  }


  // temp cache functions

  /**
   * 
   * @param {string} key 
   * @param {*} value 
   */
  const updateTemp = (key, value) => {
    setTemp((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  // updateTemp('userTotalGames', temp.user.games.length);

  // console.log(temp);

  // useEffect(() => {
  //   console.clear();

  //   if (temp.userTotalGames !== temp.user.games.length) {
  //     console.log(`%ctotal games innacurate`, `color:red`)
  //     console.log(`user total games: `, temp.userTotalGames, temp.user.games.length)
  //     updateTemp('userTotalGames', temp.user.games.length);
  //     // console.log(`user total games: `, temp.userTotalGames);
  //   }

  //   if (!temp.activeGame) {
  //     console.log(`%cno stored active game`, 'color:red');
  //     updateTemp('activeGame', temp.user.games[0]);
  //   } 
  // }, []);

  // // log if the temp cache has been updated
  // useEffect(() => {
  //   console.log(`user total games updated: `, temp.userTotalGames, temp.user.games.length)
  // }, [temp.userTotalGames]);

  // useEffect(() => {
  //   console.log(`active game set: `, temp.activeGame)
  // }, [temp.activeGame]);



  return (
    <ApplicationContext.Provider value={{
      user,
      activeGames, setActiveGames,
      contextMenu, setContextMenu,
      temp, setTemp, updateTemp,
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