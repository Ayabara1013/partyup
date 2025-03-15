'use client';
import {useAuthState} from "react-firebase-hooks/auth";
import {createContext, useContext, useEffect, useRef, useState} from 'react';
import {userAuth} from "@/javascript/firebase/base";
import {fbAccountManagement} from "@/javascript/firebase/fbAccountManagement";
import {usePathname, useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {fbGmManagement} from "@/javascript/firebase/fbGmManagement";
import {subscriptionInfo} from "@/javascript/assets/subscriptionInfo";
import {dirHref} from "@/javascript/assets/directoryHref";

const ApplicationContext = createContext(null);

export function ApplicationProvider({children}) {
  const {push} = useRouter();
  const pathname = usePathname()

  const [user] = useAuthState(userAuth);
  const [userDetails, setUserDetails] = useState(null);
  const [gmGames, setGmGames] = useState(null);
  const [playerGames, setPlayerGames] = useState(null);
  const userUpdate = useRef(null);

  //Grab custom user data once firebase loads base user.
  useEffect(() => {
    if (!userDetails) {
      checkUser();
    }
  }, [user]);

  //Grab games once custom user data is loaded.
  useEffect(() => {
    console.log('4')
    if (userDetails) {
      setGames();
      if (!userUpdate.current) {
        //creates a live feed for user updates.
        userUpdate.current = fbAccountManagement.live.userUpdate(userDetails, setUserDetails);
      }
    }
  }, [userDetails]);

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
      let tempDetails = await fbAccountManagement.get.accountDetails(user.uid);
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

  return (
    <ApplicationContext.Provider value={{user, gmGames, playerGames, userDetails,  checkUser, setGames}}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplication() {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
}