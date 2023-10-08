'use client';
import { useAuthState } from "react-firebase-hooks/auth";
import { createContext, useEffect, useState } from 'react';

import { ui } from "@/util/ui";
import { userAuth } from "@/firebase/base";
import { gameManagement } from "@/firebase/gameManagement";

export const ApplicationContext = createContext();

export function Application({ children }){
    const [ user ] = useAuthState(userAuth);

    const [ activeGames, setActiveGames ] = useState(null)

    useEffect(() => {
        ui.mainLayout.loginButton.element().classList[(user)?'add':'remove']('hidden')
        ui.mainLayout.logoutButton.element().classList[(!user)?'add':'remove']('hidden')
        updateGames();
    }, [user]);

    const alertUser = (message, type) =>{
        let alertElement = ui.mainLayout.alert.element();
        alertElement.classList.remove('hidden');
        let types = ['info', 'success', 'warning', 'error'];
        for(let item of types){
            alertElement.classList.remove(`alert-${item}`)
        }

        if(type in types){
            alertElement.classList.add(`alert-${type}`)
        }

        ui.mainLayout.alertMessage.element().innerHTML = message;
        setTimeout(()=>{
            alertElement.classList.add('hidden');
        }, 2000)
    }

    const displayPage = (isLoaded) => {
        console.log('display')
        document.getElementsByClassName('routeLoad')[0].classList[(isLoaded)?'add':'remove']('hidden');
        document.getElementsByClassName('routePage')[0].classList[(!isLoaded)?'add':'remove']('hidden');
    }
    const updateGames = async () => {
        if(user){
            let dmGames = await gameManagement.getUserDmGames();
            let playerGames = await gameManagement.getUserPlayerGames()
            let length = dmGames.length + playerGames.length || 0;
            let games = { dmGames, playerGames, length }
            setActiveGames(games)
        }
    }

    return(
        <ApplicationContext.Provider value={{
            activeGames, setActiveGames,
            displayPage, alertUser, updateGames
        }}>
            {children}
        </ApplicationContext.Provider>
    )
}