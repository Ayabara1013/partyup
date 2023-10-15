'use client';
import { useAuthState } from "react-firebase-hooks/auth";
import { createContext, useEffect, useState } from 'react';

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { fbManagement } from "@/firebase/fbManagement";

export const ApplicationContext = createContext();

export function Application({ children }) {
  const [ user ] = useAuthState(userAuth);

  const [ activeGames, setActiveGames ] = useState(null);

  useEffect(() => {
    ui.mainLayout.loginButton.element().classList[(user) ? 'add' : 'remove']('hidden');
    ui.mainLayout.logoutButton.element().classList[(!user) ? 'add' : 'remove']('hidden');
    updateGames();
  }, [ user ]);


  const displayPage = (isLoaded) => {
    document.getElementsByClassName('routeLoad')[0].classList[(isLoaded) ? 'add' : 'remove']('hidden');
    document.getElementsByClassName('routePage')[0].classList[(!isLoaded) ? 'add' : 'remove']('hidden');
  }
  const updateGames = async () => {
    if (user) {
      let dmGames = await fbManagement.get.userIsDmGames();
      let playerGames = await fbManagement.get.userIsPlayerGames();
      let length = dmGames.length + playerGames.length || 0;
      let games = { dmGames, playerGames, length }
      setActiveGames(games);
    }
  }

  return (
    <ApplicationContext.Provider value={ {
      user,
      activeGames, setActiveGames,
      displayPage, updateGames
    } }>
      { children }
    </ApplicationContext.Provider>
  )
}