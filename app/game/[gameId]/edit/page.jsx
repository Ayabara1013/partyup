'use client'

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import PageLayout from "@/components/PageLayout";

import { ui } from "@/util/ui";
import { fbManagement } from "@/firebase/fbManagement";
import { ApplicationContext } from "@/app/ApplicationContext";

export default function Page({ params }) {
  const { push } = useRouter();

  const { activeGames, displayPage } = useContext(ApplicationContext);
  const [ game, setGame ] = useState(null);

  let { gameId } = params;

  console.log(activeGames)
  useEffect(() => {
    if (game)
      displayPage(true);
  }, [ game ]);

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

    let name = ui.editGame.name.element().value;
    let description = ui.editGame.description.element().value;
    let isPublic = false;
    let maxPlayers = parseInt(ui.editGame.maxPlayers.element().value);

    let hasActs = ui.editGame.hasActs.element().checked;
    let currentAct = parseInt(ui.editGame.currentAct.element().value);
    let maxActs = parseInt(ui.editGame.maxActs.element().value);

    let hasChapters = ui.editGame.hasChapters.element().checked;
    let currentChapter = parseInt(ui.editGame.currentChapter.element().value);
    let maxChapters = parseInt(ui.editGame.maxChapters.element().value);

    await fbManagement.dm.updateGame(gameId, name, description, isPublic, maxPlayers, hasActs, currentAct, maxActs, hasChapters, currentChapter, maxChapters);
    push('/user/activeGames');
    e.target.removeAttribute('disabled');
  }

  return (activeGames && game) && (
    <PageLayout title={ `Edit: ${ game.name }` } backHref="/user/activeGames">
      <div className="flex flex-col">
        <EditFormInput title={ "What is the game name" } id={ ui.editGame.name.id } defaultValue={ game.name }/>
        <EditFormInput title={ "Game description (optional)" } id={ ui.editGame.description.id }
                       defaultValue={ game.description }/>
        <EditFormActChapter game={ game }/>
        <EditFormInput type="players" title={ "Max Players:" } id={ ui.editGame.maxPlayers.id }
                       defaultValue={ game.maxPlayers }/>
      </div>
      <button className="btn mt-5" onClick={ updateGameOnClick }>Update Game!</button>
    </PageLayout>
  )
}


function EditFormInput({ title, id, type, defaultValue }) {
  const onCheck = (e) => {
    let toggleId = e.target.value
    if (e.target.checked) {
      document.getElementById(toggleId).removeAttribute('disabled');
    } else {
      document.getElementById(toggleId).setAttribute('disabled', true);
    }
  }

  switch (type) {
    case 'players': {
      return (
        <div className="center w-full">
          <div className="form-control w-10/12">
            <label className="label">
              <span className="label-text">{ title }</span>
            </label>
            <select className="select select-bordered" defaultValue={ defaultValue } id={ id }>
              <option value="1">1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              <option value='6'>6</option>
            </select>
          </div>
        </div>
      )
    }
    default:
      return (
        <div className="center w-full">
          <div className="form-control w-10/12">
            <label className="label">
              <span className="label-text">{ title }</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered w-full" id={ id }
                   defaultValue={ defaultValue }/>
          </div>
        </div>
      )
  }
}

function EditFormActChapter({ game }) {
  let { hasActs, hasChapters, maxActs, maxChapters, currentAct, currentChapter } = game
  const onCheck = (e) => {
    let toggleId = e.target.value
    if (e.target.checked) {
      ui.editGame[`max${ toggleId }s`].element().removeAttribute('disabled');
      ui.editGame[`current${ toggleId }`].element().removeAttribute('disabled');
    } else {
      ui.editGame[`max${ toggleId }s`].element().setAttribute('disabled', true);
      ui.editGame[`current${ toggleId }`].element().setAttribute('disabled', true);
    }
  }

  const maxActOnChange = (e) => {
    let currentElement = ui.editGame.currentAct.element();
    currentElement.max = e.target.value;
    if (currentElement.value > currentElement.max) currentElement.value = currentElement.max;
  }
  const maxChapterOnChange = (e) => {
    let currentElement = ui.editGame.currentChapter.element();
    currentElement.max = e.target.value;
    if (currentElement.value > currentElement.max) {
    }
    currentElement.value = currentElement.max;
    currentActOnChange();
  }

  const currentActOnChange = () => {
    ui.editGame.currentChapter.element().value = 1;
  }
  console.log(hasChapters, hasActs)

  return (
    <div className="center w-full">
      <div className="flex flex-col w-10/12">

        <div className="center w-full gap-4">
          <div className="form-control w-1/2">
            <label className="label">
              <span className="label-text">Does your game use acts? (Max Acts)</span>
            </label>
            <div className="input-group center vertical w-full">
              <input type="checkbox" className="checkbox h-full" value="Act" onChange={ onCheck }
                     id={ui.editGame.hasActs.id} defaultChecked={ hasActs }/>
              <input type="number" placeholder="Count" defaultValue={ maxActs } className="input input-bordered w-full"
                     id={ ui.editGame.maxActs.id } min={ 1 } onChange={ maxActOnChange } disabled={ !hasActs }/>
            </div>
          </div>
          <div className="form-control w-1/2">
            <label className="label">
              <span className="label-text">Does your game use chapters? (Max Chapters)</span>
            </label>
            <div className="input-group center vertical w-full">
              <input type="checkbox" className="checkbox h-full" value="Chapter" onChange={ onCheck }
                     id={ui.editGame.hasChapters.id} defaultChecked={ hasChapters }/>
              <input type="number" placeholder="Count" defaultValue={ maxChapters }
                     className="input input-bordered w-full"
                     id={ ui.editGame.maxChapters.id } min={ 1 } onChange={ maxChapterOnChange }
                     disabled={ !hasChapters }/>
            </div>
          </div>
        </div>

        <div className="center w-full gap-4">
          <div className="form-control w-1/2">
            <label className="label">
              <span className="label-text">Current Act:</span>
            </label>
            <input type="number" placeholder="Count" defaultValue={ currentAct } className="input input-bordered w-full"
                   id={ ui.editGame.currentAct.id } min={ 1 } max={ maxActs } onChange={ currentActOnChange }
                   disabled={ !hasActs }/>
          </div>
          <div className="form-control w-1/2">
            <label className="label">
              <span className="label-text">Current Chapter:</span>
            </label>
            <input type="number" placeholder="Count" defaultValue={ currentChapter }
                   className="input input-bordered w-full"
                   id={ ui.editGame.currentChapter.id } min={ 1 } max={ maxChapters } disabled={ !hasChapters }/>
          </div>
        </div>

      </div>
    </div>
  )
}