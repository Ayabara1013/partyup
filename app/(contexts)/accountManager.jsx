'use client';
import {useAuthState} from "react-firebase-hooks/auth";
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {userAuth} from "@/javascript/firebase/base";
import {fbAccountManager} from "@/javascript/firebase/fbAccountManager";
import {usePathname, useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {fbGmManager} from "@/javascript/firebase/fbGmManager";
import {subscriptionInfo} from "@/javascript/assets/subscriptionInfo";
import {dirHref} from "@/javascript/assets/directoryHref";

const AccountManagerContext = createContext(null);

export function AccountManagerProvider({children}) {
  const {push} = useRouter();
  const pathname = usePathname()

  const [user] = useAuthState(userAuth);
  const [userDetails, setUserDetails] = useState(null);
  const [gmGames, setGmGames] = useState(null);
  const [playerGames, setPlayerGames] = useState(null);
  const userUpdate = useRef(null);
  const otherUpdates = useRef(null);

  //Grab custom user data once firebase loads base user.
  useEffect(() => {
    if (!userDetails) {
      checkUser();
    }
  }, [user]);

  //Grab games once custom user data is loaded.
  useEffect(() => {
    if (userDetails) {
      setGames();
    }
    startLiveUpdates()
  }, [userDetails]);

  useEffect(() => {
    startLiveUpdates()
  }, [gmGames]);


  function startLiveUpdates() {
    if (userDetails) {
      if (!userUpdate.current && userDetails) {
        //creates a live feed for user updates.
        userUpdate.current = fbAccountManager.live.userUpdate(userDetails, setUserDetails);
      }
      if (!otherUpdates.current && gmGames && userDetails) {
        //creates a live feed for user updates.
        otherUpdates.current = fbAccountManager.live.fullUpdates(userDetails, setUserDetails, gmGames, setGames);
      }
    }
  }

  //Navigation check for confirm name and subscription.
  useEffect(() => {
    console.log(pathname)
    const ignoreRedirect = ![
      '/user/signup',
      '/user/choose-your-name',
      '/user/subscription'
    ].includes(pathname);
  }, [pathname]);

  //Grab custom user data
  const checkUser = async () => {
    const ignoreRedirect = ![
      '/user/signup',
      '/user/choose-your-name',
      '/user/subscription'
    ].includes(pathname);
    if (user) {
      let tempDetails = await fbAccountManager.get.accountDetails(user.uid);
      if (tempDetails) {
        //If displayName is not confirmed, redirect
        if (tempDetails.uNameConfirmation === false && ignoreRedirect) {
          toast.error(`You have yet to choose your display name, redirecting...`)
          setTimeout(() => {
            push(dirHref.user.chooseDisplayName)
          }, 1000)
          //If subscription plan is not confirmed, redirect
        } else if (tempDetails.planConfirmation === false && ignoreRedirect) {
          toast.error(`You have yet to choose your plan, redirecting...`)
          setTimeout(() => {
            push(dirHref.user.subscription)
          }, 1000)
        } else {
          //If all is well, set value
          setUserDetails(tempDetails)
        }
        //If user quickly moved on from previous page,
      } else if (ignoreRedirect) {
        toast.error(`Your account is missing some details, redirecting...`)
        setTimeout(() => {
          push(dirHref.user.chooseDisplayName)
        }, 3000)
      }
    }
  }

  //Grab games
  const setGames = async (games) => {
    setGmGames(games ? games : await fbGmManager.general.getGames(userDetails.id))
  }

  function maxGames() {
    return subscriptionInfo[`tier${userDetails.planTier}`].gmGames
  }

  function canCreate() {
    return maxGames() > (gmGames ? gmGames.length : maxGames())
  }

  return (
    <AccountManagerContext.Provider
      value={{user, gmGames, playerGames, userDetails, checkUser, setGames, canCreate, maxGames}}>
      {children}
    </AccountManagerContext.Provider>
  )
}

export function useAccountManager() {
  const context = useContext(AccountManagerContext);
  if (!context) {
    throw new Error('useAccountManager must be used within an AccountManagerProvider');
  }
  return context;
}