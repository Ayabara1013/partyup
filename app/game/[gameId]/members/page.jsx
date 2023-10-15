'use client'

import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";


import PageLayout from "@/components/PageLayout";
import LoadingUi from "@/components/LoadinUi";
import { toastUser } from "@/util/functions";
import { ApplicationContext } from "@/app/ApplicationContext";
import { fbManagement } from "@/firebase/fbManagement";

export default function Page({ params }) {
  let { gameId } = params;
  const { push } = useRouter();
  const { user, activeGames, displayPage } = useContext(ApplicationContext);

  const [ game, setGame ] = useState(null);


  useEffect(() => {
    getGame();
  }, [ user ]);

  const getGame = async () => {

    let gameDoc = await fbManagement.get.singleGame(gameId);
    for (let item of activeGames.dmGames) {
      if (item.game.id === gameId) {
        if (!gameDoc) {
          toastUser('Unable to grab game documents.', 'error');
          push('/user/activeGames');
        }
        setGame(gameDoc);
        displayPage(true);
        return;
      }
    }
    toastUser('You do not have permission to see this page.', 'error');
    push('/user/activeGames');
  }
  //Todo: Kick player
  const kickOnClick = async () => {
  }

  return (
    <PageLayout title={ (game) ? `${ game.name } - Members` : '... - Members' } backHref="/home">
      { (game) ?
        <>
          <div className="w-full center px-2">
            <h2 className="w-1/4 flex mt-4 px-2 border">Game Description:</h2>
            <h2 className="w-3/4 flex mt-4 px-2 border">{ game.description }</h2>
          </div>
          <div className="w-full flex flex-col px-2">
            <h2 className="w-full flex mt-4 px-2 border">Players:</h2>
            <div className="w-full flex flex-col mt-4 px-2 border">
              { game.members.map(member =>
                <div key={ member.id } className="w-full flex mt-2">
                  <span className="w-3/4 flex text-center border">{ member.uName }</span>
                  <button className="w-1/4 flex btn" onClick={ kickOnClick }>Kick</button>
                </div>
              ) }
              { (game.members.length === 0) && <div className="w-full flex mt-2">No players yet!</div> }
            </div>
          </div>
        </>
        : <LoadingUi/> }
    </PageLayout>
  )
}