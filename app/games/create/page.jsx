"use client"

import toast from "react-hot-toast";
import {useEffect} from 'react'
import {useRouter} from "next/navigation";

import {Forms} from "@components/templates/forms";
import {useApplication} from "@app/(contexts)/application";
import {useGameManager} from "@app/(contexts)/gameManager";
import {fbGmManagement} from "@/javascript/firebase/fbGmManagement";
import {firefoxNumberInputOnKeyDown} from "@/javascript/util/browserFixes/firefox";

export default function GameCreate({className}) {
  const {push} = useRouter();
  const {userDetails, gmGames, setGames} = useApplication();
  const {gameInfoRefs, safetyChecks, getFormData} = useGameManager();
  const {gameNameRef, systemRef, maxPlayersRef, tagsRef, publicGameRef} = gameInfoRefs

  useEffect(() => {
    if (userDetails) {
      setGames();
    }
  }, [userDetails]);

  useEffect(() => {
    if (gmGames && !gmGames.canCreate()) {
      toast.error(`You need to upgrade your plan for more slots for gm games!`)
      push('/games/my-games')
    }
  }, [])

  const submitOnClick = async () => {
    let data = getFormData(userDetails);
    console.log(data)
    toast(`Game info. has been sent.`)
    if (await fbGmManagement.general.createGame(data)) {
      setTimeout(() => {
        toast.success("Game created successfully.");
        push('/games/my-games')
      }, 1500)
    } else {
      toast.error(`Game was not created.`)
    }
  }

  return (
    <div className={`${className} game-create-page tb1 flex h-full m-auto justify-center`}>
      <div className='flex-col-4 my-auto p-8 bg-neutral w-[60vw] rounded-xl'>
        <h1 className={`font-medium text-2xl`}>Create your game</h1>

        {/* enter game name */}
        <Forms.DefaultInputField forwardRef={gameNameRef}
                                 labelText="What is the name of your game?" defaultValue={'Test Game'}/>

        {/* select system */}
        <Forms.DefaultInputField type='select' forwardRef={systemRef} defaultValue={''}
                                 labelText="What system will you be using?">
          <option value={''} disabled>what system do you want to use?</option>
          <option value={'dnd5e'}>Dungeons & Dragons 5e</option>
          <option value={'pf2e'}>Pathfinder 2e</option>
          <option value={'fae'}>Fate Accelerated</option>
          <option value={'swade'}>Savage Worlds</option>
        </Forms.DefaultInputField>

        {/* enter max players */}
        <Forms.DefaultInputField type={'number'} forwardRef={maxPlayersRef} min={1} max={4} defaultValue={2}
                                 onKeyDown={firefoxNumberInputOnKeyDown}
                                 labelText="Enter your preferred number of players (Max: 4)"
                                 labelSubText="(not including yourself)"/>
        {/* select safety checks */}
        <Forms.DefaultInputField type={'checkList'} list={safetyChecks}
                                 labelText="Select your safety checks: (optional)"
                                 labelSubText="You can change these in the future!"/>

        <Forms.DefaultInputField forwardRef={tagsRef} placeholder={'Input tags'} defaultValue={`dnd,ocean,world`}
                                 labelText="Add tags to your game (optional):"
                                 labelSubText="Seperate tags with commas with no spaces (,)"/>
        <Forms.DefaultInputField forwardRef={publicGameRef} type={'checkbox'} checked={true} readOnly={true}
                                 labelText="Is this a public game?"
                                 labelSubText="(Will be static public for testing)"/>
        {/*  the confirm button needs to check if all the fields are valid! */}
        <button className='px-4 btn btn-primary m-auto' onClick={submitOnClick}>confirm</button>
      </div>
    </div>
  )
}