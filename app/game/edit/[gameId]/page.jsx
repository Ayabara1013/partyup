'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PageLayout from "@/components/PageLayout";
import EditFormInput from "@/app/game/edit/[gameId]/_EditFormInput";
import EditFormActChapterInput from "@/app/game/edit/[gameId]/_EditFormActChapterInput";

import { ui } from "@/util/ui";
import { fbManagement } from "@/firebase/fbManagement";
import { useApplicationContext } from "@/app/ApplicationContext";
import toast from "react-hot-toast";
export default function Page({ params }) {
  const { push } = useRouter();

  let { gameId } = params;
  const { activeGames } = useApplicationContext();
  const [ game, setGame ] = useState(null);

  useEffect(() => {
    if (activeGames) {
      for (let game of activeGames.dmGames) {
        if (game.id === gameId) {
          setGame(game);
          return;
        }
      }
      push('/home');
    }
  }, [ activeGames ]);

  const updateGameOnClick = async (e) => {
    e.target.setAttribute('disabled', true)
    let errMsg = ''
    //Set up data
    let name = ui.editGame.name.element().value.trim();
    let description = ui.editGame.description.element().value.trim();
    let isPublic = false;
    let maxPlayers = parseInt(ui.editGame.maxPlayers.element().value);
    let hasActs = ui.editGame.hasActs.element().checked;
    let hasChapters = ui.editGame.hasChapters.element().checked;
    let currentChapter = parseInt(ui.editGame.currentChapter.element().value);
    let maxChapters = parseInt(ui.editGame.maxChapters.element().value);
    let currentAct = parseInt(ui.editGame.currentAct.element().value);
    let maxActs= parseInt(ui.editGame.maxActs.element().value);

    //Validate data
    if(name === '') {
      errMsg = 'Game name cannot be empty';
    }
    //Validate act numbers if applicable
    if(hasActs){
      (!currentAct) && (errMsg = 'Current Act cannot be empty');
      (!maxActs) && (errMsg = 'Max Acts cannot be empty');
      if(currentAct > maxActs){
        errMsg = 'Current Act cannot be greater than Max Acts';
      }
    }
    //Validate chapter numbers if applicable
    if(hasChapters){
      (!currentChapter) && (errMsg = 'Current Chapter cannot be empty');
      (!maxChapters) && (errMsg = 'Max Chapters cannot be empty');
      if(currentChapter > maxChapters){
        errMsg = 'Current Chapter cannot be greater than Max Chapters';
      }
    }
    //Set up data with conditional updates fields
    let data = {
      name,
      description,
      isPublic,
      maxPlayers,
      hasActs,
      ...hasActs && { currentAct },
      ...hasActs && { maxActs },
      hasChapters,
      ...hasActs && { currentChapter },
      ...hasActs && { maxChapters },
    }

    if(errMsg !== ''){
      toast.error(errMsg);
      e.target.removeAttribute('disabled');
      return;
    }
    //Update game
    await fbManagement.dm.updateGame(gameId, data);
    e.target.removeAttribute('disabled');
    push('/user/activeGames');
  }

  return (activeGames && game) && (
    <PageLayout title={ `Edit: ${ game.name }` } backHref="/user/activeGames">
      <div className="flex flex-col">
        <EditFormInput title={ "What is the game name" } id={ ui.editGame.name.id } defaultValue={ game.name }/>
        <EditFormInput title={ "Game description (optional)" } id={ ui.editGame.description.id }
                       defaultValue={ game.description }/>
        <EditFormActChapterInput game={ game }/>
        <EditFormInput type="players" title={ "Max Players:" } id={ ui.editGame.maxPlayers.id }
                       defaultValue={ game.maxPlayers }/>
      </div>
      <button className="btn mt-5" onClick={ updateGameOnClick }>Update Game!</button>
    </PageLayout>
  )
}