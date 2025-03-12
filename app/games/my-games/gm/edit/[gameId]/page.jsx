"use client"

import {useEffect, useMemo, useRef, useState} from 'react'
import {Forms} from "@components/templates/forms";
import {firefoxNumberInputOnKeyDown} from "@/javascript/util/browserFixes/firefox";
import {useApplication} from "@app/(contexts)/application";
import {fbGmManagement} from "@/javascript/firebase/fbGmManagement";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useGameManager} from "@app/(contexts)/gameManager";

export default function GameCreate({className, params}) {
  let {gameId} = params;
  const {push} = useRouter();
  const {gmGames, setGames, userDetails} = useApplication();
  const [selectedGame, setSelectedGame] = useState();

  const {gameInfoRefs, safetyChecks, getFormData} = useGameManager();
  const {gameNameRef, systemRef, maxPlayersRef, tagsRef, publicGameRef} = gameInfoRefs

  const tags = useMemo(() => {
    let temp = ''
    if (selectedGame) {
      for (let i = 0; i < selectedGame.tags.length; i++) {
        temp += i > 0 ? ',' : ''
        temp += selectedGame.tags[i];
      }
    }
    return temp
  }, [selectedGame])

  useEffect(() => {
    if (userDetails) {
      setGames();
    }
  }, []);
  useEffect(() => {
    if (selectedGame) {
      let temp = ''
      for (let i = 0; i < selectedGame.tags.length; i++) {
        temp += i > 0 ? ',' : ''
        temp += selectedGame.tags[i];
      }
      tagsRef.current.value = temp;
      for (let i = 0; i < safetyChecks.length; i++) {
        safetyChecks[i].ref.current.checked = selectedGame[`sc` + i];
      }
    }
  }, [selectedGame]);

  useEffect(() => {
    if (gmGames) {
      for (let game of gmGames.gameList) {
        if (gameId === game.id) {
          setSelectedGame(game)
          break;
        }
      }
    }
  }, [gmGames])

  const updateOnClick = async () => {
    let data = getFormData(userDetails);

    if (await fbGmManagement.general.updateGame(data, gameId)) {
      toast.success("Game updated successfully.");
      await setGames();
      push('/games/my-games')
    } else {
      toast.error(`Game did not update.`)
    }
  }

  return (
    (selectedGame &&
      <div className={`${className} game-create-page tb1 flex h-full m-auto justify-center`}>
        <div className='flex-col-4 my-auto p-8 bg-neutral w-[60vw] rounded-xl'>
          <h1 className={`font-medium text-2xl`}>Create your game</h1>

          {/* enter game name */}
          <Forms.DefaultInputField forwardRef={gameNameRef}
                                   labelText="What is the name of your game?" defaultValue={selectedGame.name}/>

          {/* select system */}
          <Forms.DefaultInputField type='select' forwardRef={systemRef} defaultValue={selectedGame.system}
                                   labelText="What system will you be using?">
            <option value={''} disabled>what system do you want to use?</option>
            <option value={'dnd5e'}>Dungeons & Dragons 5e</option>
            <option value={'pf2e'}>Pathfinder 2e</option>
            <option value={'fae'}>Fate Accelerated</option>
            <option value={'swade'}>Savage Worlds</option>
          </Forms.DefaultInputField>

          {/* enter max players */}
          <Forms.DefaultInputField type={'number'} forwardRef={maxPlayersRef} min={1} max={4}
                                   defaultValue={selectedGame.maxPlayers}
                                   onKeyDown={firefoxNumberInputOnKeyDown}
                                   labelText="Enter your preferred number of players (Max: 4)"
                                   labelSubText="(not including yourself)"/>
          {/* select safety checks */}
          <Forms.DefaultInputField type={'checkList'} list={safetyChecks}
                                   labelText="Select your safety checks: (optional)"
                                   labelSubText="You can change these in the future!"/>

          <Forms.DefaultInputField forwardRef={tagsRef} placeholder={'Input tags'} defaultValue={tags}
                                   labelText="Add tags to your game (optional):"
                                   labelSubText="Seperate tags with commas with no spaces (,)"/>
          <Forms.DefaultInputField forwardRef={publicGameRef} type={'checkbox'} checked={selectedGame.isPublic}
                                   readOnly={true}
                                   labelText="Is this a public game?"
                                   labelSubText="(Will be static public for testing)"/>
          {/*  the confirm button needs to check if all the fields are valid! */}
          <button className='px-4 btn btn-primary m-auto' onClick={updateOnClick}>update</button>
        </div>
      </div>
    )
  )
}