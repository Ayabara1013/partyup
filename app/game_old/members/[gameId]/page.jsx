'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


import PageLayout from "@/components/PageLayout";
import { useApplicationContext } from "@/app/ApplicationContext";
import { fbManagement } from "@/firebase/fbManagement";
import moment from "moment";
import toast from "react-hot-toast";

export default function Page({ params }) {
  let { gameId } = params;
  const { push } = useRouter();
  const { activeGames } = useApplicationContext();
  const [ game, setGame ] = useState(null);

  useEffect(() => {
    (activeGames) && getGame();
  }, [ activeGames ]);

  const getGame = async () => {
    let gameDoc = await fbManagement.get.singleGame(gameId);
    for (let game of activeGames.dmGames) {
      if (game.id === gameId) {
        if (!gameDoc) {
          toast.error('Unable to grab game documents.');
          push('/user/activeGames');
        }
        setGame(gameDoc);
        return;
      }
    }
    toast.error('You do not have permission to see this page.');
    push('/user/activeGames');
  }
  //Todo: Kick player
  const kickOnClick = async () => {
  }

  return (
    <PageLayout title={ `${ game?.name } - Members` } backHref="/home">
      <div className="stat-value">Players</div>
      <div className="divider"/>
      <div className="">
        { game?.members.map(member =>
          <div key={ member.id } className="stats player w-full">
            <div className="stat">
              <div className="stat-title">Player Name:</div>
              <div className="stat-value">{ member.uName }</div>
            </div>
            <div className="stat">
              <div className="stat-title">Join Date:</div>
              <div className="stat-value text-xl">{ moment(member.joinDate).calendar() }</div>
            </div>
            <div className="stat">
              <button className="w-full h-full flex btn" onClick={ kickOnClick }>Kick</button>
            </div>
          </div>
        ) }
        { (game?.members.length === 0) && <div className="w-full flex mt-2">No players yet!</div> }
      </div>
    </PageLayout>
  )
}