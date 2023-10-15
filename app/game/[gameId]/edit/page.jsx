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
      for (let gameInfo of activeGames.dmGames) {
        let { game } = gameInfo;
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
    let isPublic = ui.editGame.isPublic.element().checked;
    let playerCount = parseInt(ui.editGame.playerCount.element().value);

    await fbManagement.dm.updateGame(gameId, name, description, isPublic, playerCount);
    push('/user/activeGames');
    e.target.removeAttribute('disabled');
  }

  return (activeGames && game) && (
    <PageLayout title={ `Edit ${ game.name }` } backHref="/user/activeGames">
      <div className="w-full flex mt-4">
        <label className="w-1/4 mx-2">Game Name: </label>
        <input className="w-3/4 mx-2" type="text" placeholder="Enter a name" id={ ui.editGame.name.id }
               defaultValue={ game.name }/>
      </div>
      <div className="w-full flex mt-4">
        <label className="w-1/4 mx-2">Game Description (optional): </label>
        <input className="w-3/4 mx-2" type="text" placeholder="Enter a description" id={ ui.editGame.description.id }
               defaultValue={ game.description }/>
      </div>
      <div className="w-full flex mt-4">
        <div className="w-1/2 flex mx-2">
          <label className="w-1/2">Public Game?: </label>
          <input className="" type="checkbox" id={ ui.editGame.isPublic.id } defaultChecked={ game.isPublic }/>
        </div>
        <div className="w-1/2 flex mx-2">
          <label className="w-1/2">Max Player Count: </label>
          <select className="w-1/2" defaultValue={ game.playerMax } id={ ui.editGame.playerCount.id }>
            <option value="1">1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
            <option value='6'>6</option>
          </select>
        </div>
      </div>
      <button className="btn mt-5" onClick={ updateGameOnClick }>Update Game!</button>
    </PageLayout>
  )
}