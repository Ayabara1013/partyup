'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PageLayout from "@/components/PageLayout";
import LoadingUi from "@/components/LoadinUi";

import { useApplicationContext } from "@/app/ApplicationContext";
import { fbManagement } from "@/firebase/fbManagement";
import toast from "react-hot-toast";

export default function Page({ params }) {
  let { inviteCode } = params;
  const { push } = useRouter();
  const { user, activeGames } = useApplicationContext();

  const [ game, setGame ] = useState(null);


  useEffect(() => {
    getGameFromInvite();
  }, [ activeGames ]);

  const getGameFromInvite = async () => {
    if(user && activeGames){
      let gameDoc = await fbManagement.player.findGameFromInviteCode(inviteCode);
      if (!gameDoc) {
        toast.error('Invalid invite code.');
        push('/home');
      }
      for (let game of activeGames.dmGames) {
        if (game.id === gameDoc.id) {
          toast.error('You are the DM of this game.');
          push('/home');
          return;
        }
      }
      for (let game of activeGames.playerGames) {
        if (game.id === gameDoc.id) {
          toast.error('You have already joined this game.');
          push('/home');
          return;
        }
      }
      setGame(gameDoc);
    }
  }

  const joinGameOnClick = async () => {
    push('/home');
    await fbManagement.player.acceptInviteLink(inviteCode, game.id);
    toast.success(`You have joined the game: ${ game.name }`);
  }

  return (
    <PageLayout title={ `Join Game: ${ game?.name }` } backHref="/home">
      { (game) ?
        <>
          <div className="w-full center px-2">
            <h2 className="w-1/4 flex mt-4 px-2 border">Game Description:</h2>
            <h2 className="w-3/4 flex mt-4 px-2 border">{ game.description }</h2>
          </div>
          <div className="w-full center px-2">
            <h2 className="w-1/4 flex mt-4 px-2 border">DM:</h2>
            <h2 className="w-3/4 flex mt-4 px-2 border">{ game.uName }</h2>
          </div>
          <div className="w-full flex flex-col px-2">
            <h2 className="w-full flex mt-4 px-2 border">Players:</h2>
            <div className="w-full flex flex-col mt-4 px-2 border">
              { game.members.map(member =>
                <div key={ member.id } className="w-full flex mt-2">{ member.uName }</div>
              ) }
              { (game.members.length === 0) && <div className="w-full flex mt-2">No players yet!</div> }
            </div>
            <button className="btn mt-5" onClick={ joinGameOnClick }>Join Game!</button>
          </div>
        </>
        : <LoadingUi/> }
    </PageLayout>
  )
}