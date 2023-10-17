'use client';
import { useAuthState } from "react-firebase-hooks/auth";
import { createContext, useEffect, useState } from 'react';

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { fbManagement } from "@/firebase/fbManagement";

export const ApplicationContext = createContext();

export function Application({ children }) {
  const [ user ] = useAuthState(userAuth);
  const [ updateOn, setUpdateOn ] = useState(false);

  const [ activeGames, setActiveGames ] = useState(null);

  useEffect(() => {
    ui.mainLayout.loginButton.element().classList[(user) ? 'add' : 'remove']('hidden');
    ui.mainLayout.logoutButton.element().classList[(!user) ? 'add' : 'remove']('hidden');
    if (user) {
      setGames();
    }
  }, [ user ]);
  useEffect(() => {
    if (user && !updateOn) {
      fbManagement.live.userIsDmGames(updateDmGames);
      fbManagement.live.userIsPlayerGames(updatePlayerGames);
      setUpdateOn(true);
    }
  }, [ activeGames ]);
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

  const displayPage = (isLoaded) => {
    document.getElementsByClassName('routeLoad')[0].classList[(isLoaded) ? 'add' : 'remove']('hidden');
    document.getElementsByClassName('routePage')[0].classList[(!isLoaded) ? 'add' : 'remove']('hidden');
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

  return (
    <ApplicationContext.Provider value={ {
      user,
      activeGames, setActiveGames,
      displayPage
    } }>
      { children }
    </ApplicationContext.Provider>
  )
}