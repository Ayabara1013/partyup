"use client"

import {use, useEffect, useState} from 'react'
import {Forms} from "@components/templates/forms";
import {firefoxNumberInputOnKeyDown} from "@/javascript/util/browserFixes/firefox";
import {useAccountManager} from "@app/(contexts)/accountManager";
import {fbGmManager} from "@/javascript/firebase/managers/fbGmManager";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {useGameManager} from "@app/(contexts)/gameManager";
import {gameSystems} from "@/javascript/assets/gameSystems";
import {dirHref} from "@/javascript/assets/directoryHref";

export default function GameCreate({className, params}) {
  const {push} = useRouter();
  const {gmGames, setGames, userDetails} = useAccountManager();
  const [selectedGame, setSelectedGame] = useState();

  const {gameId} = use(params);

  const {gameInfoRefs, safetyChecks, getFormData} = useGameManager();
  const {gameNameRef, systemRef, maxPlayersRef, tagsRef, publicGameRef, descRef} = gameInfoRefs

  //load game list.
  useEffect(() => {
    if (gmGames) {
      for (let game of gmGames) {
        if (gameId === game.id) {
          setSelectedGame(game)
          return;
        }
      }
      toast.error('You are not the GM (Owner) of this game.');
      push(dirHref.games.root)
    }
  }, [gmGames])

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


  const updateOnClick = async () => {
    let data = getFormData(userDetails);

    if (await fbGmManager.general.updateGame(data, gameId)) {
      toast.success("Game updated successfully.");
      await setGames();
      push(dirHref.games.root)
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

          <Forms.DefaultInputField forwardRef={descRef} type={'textarea'} rows={`3`} defaultValue={selectedGame.desc}
                                   labelText="What is the description of your game?"/>
          {/* select system */}
          <Forms.DefaultInputField type='select' forwardRef={systemRef} defaultValue={selectedGame.system}
                                   labelText="What system will you be using?">
            <option value={''} disabled>what system do you want to use?</option>
            {gameSystems.array.map((gameSystem, index) => {
              return <option value={gameSystem.value} key={index}>{gameSystem.title}</option>
            })}
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

          <Forms.DefaultInputField forwardRef={tagsRef} placeholder={'Input tags'} defaultValue={``}
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