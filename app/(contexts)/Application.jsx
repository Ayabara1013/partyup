'use client';
import {useAuthState} from "react-firebase-hooks/auth";
import {createContext, useContext, useEffect, useState} from 'react';
import {userAuth} from "@/javascript/firebase/base";
import {fbGenericManagement} from "@/javascript/firebase/fbGenericManagement";
import {fbAccountManagement} from "@/javascript/firebase/fbAccountManagement";
import {usePathname, useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {fbGmManagement} from "@/javascript/firebase/fbGmManagement";
import {subscriptionInfo} from "@/javascript/assets/subscriptionInfo";

const ApplicationContext = createContext(null);

export function ApplicationProvider({children}) {
  const pathname = usePathname()
  const [user] = useAuthState(userAuth);
  const {push} = useRouter();

  const [updateOn, setUpdateOn] = useState(false);
  const [activeGames, setActiveGames] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [gmGames, setGmGames] = useState(null);
  const [playerGames, setPlayerGames] = useState(null);

  useEffect(() => {
    console.log('2')
    if (user) {
      if (!userDetails) {
        checkUser();
      }
      if (userDetails) {
        setGames();
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && !updateOn) {
      console.log('3')
      fbGenericManagement.live.userIsDmGames(updateDmGames);
      fbGenericManagement.live.userIsPlayerGames(updatePlayerGames);
      setUpdateOn(true);
    }
  }, [activeGames]);

  useEffect(() => {
    console.log('4')
    if (userDetails) {
      setGames();
    }
  }, [userDetails]);


  const setGames = async () => {
    let tempGames = {
      gameList: await fbGmManagement.general.getGames(userDetails.id),

      max: subscriptionInfo[`tier${userDetails.planTier}`].gmGames,

      activeGames: function () {
        return this.gameList.length
      },
      availableGames: function () {
        return this.max - this.gameList.length
      },
      canCreate: function () {
        return (this.max - this.gameList.length) > 0
      },
    }
    setGmGames(tempGames)
  }

  const checkUser = async () => {
    const ignoreRedirect = ![
      '/user/signup',
      '/user/choose-your-name',
      '/user/subscription'
    ].includes(pathname);
    if (user) {
      let tempDetails = await fbAccountManagement.get.accountDetails(user.uid);
      if (tempDetails) {
        //If displayName is not confirmed, redirect
        if (tempDetails.displayNameConfirmation === false && ignoreRedirect) {
          toast.error(`You have yet to choose your display name, redirecting...`)
          setTimeout(() => {
            push('/user/choose-your-name')
          }, 1000)
          //If subscription plan is not confirmed, redirect
        } else if (tempDetails.planConfirmation === false && ignoreRedirect) {
          toast.error(`You have yet to choose your plan, redirecting...`)
          setTimeout(() => {
            push('/user/subscription')
          }, 1000)
        } else {
          //If all is well, set value
          setUserDetails(tempDetails)
        }
        //If user quickly moved on from previous page,
      } else if (ignoreRedirect) {
        toast.error(`Your account is missing some details, redirecting...`)
        setTimeout(() => {
          push('/user/choose-your-name')
        }, 3000)
      }
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
        game.unsub = await fbGenericManagement.live.memberJoined(game, updateDmGames);
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
    <ApplicationContext.Provider value={{user, activeGames, gmGames, playerGames, userDetails, checkUser, setGames}}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplicationContext must be used within an ApplicationContextProvider');
  }
  return context;
}