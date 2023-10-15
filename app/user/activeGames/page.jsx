'use client'

import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

import LoadingUi from "@/components/LoadinUi";
import PageLayout from "@/components/PageLayout";

import { toastUser } from "@/util/functions";

import { baseUrl } from "@/util/baseUrl";
import { fbManagement } from "@/firebase/fbManagement";
import { ApplicationContext } from "@/app/ApplicationContext";

export default function Page() {
  const { push } = useRouter();

  const { activeGames, displayPage } = useContext(ApplicationContext);

  useEffect(() => {
    displayPage(true);
  }, []);

  const startOnClick = async (e) => {
    let gameId = e.target.value;
    for (let gameInfo of activeGames.dmGames) {
      if (gameInfo.game.id === gameId) {
        await fbManagement.dm.startGame(gameId);
        toastUser(`'${ gameInfo.game.name }' has started!`, 'info');
        return;
      }
    }
  }

  const gameOptionOnClick = (e) => {
    let gameId = e.target.value;
    for (let gameInfo of activeGames.dmGames) {
      if (gameInfo.game.id === gameId) {
        let req = e.target.attributes.dir.value;
        push(`/game/${ gameId + req }`);
        return;
      }
    }
    for (let game of activeGames.playerGames) {
      if (game.id === gameId) {
        push(`/game/${ gameId }`);
        return;
      }
    }
  }

  const copyInviteOnClick = async (e) => {
    await navigator.clipboard.writeText(`${ baseUrl }invite/${ e.target.value }`);
    toastUser('Invite code copied to clipboard.', 'info');
  }

  const generateDmList = () => {
    let elementList = [
      <h1 key="DMGamestitle" className="w-full text-center text-3xl mt-5">DM Games</h1>
    ]
    for (let gameInfo of activeGames.dmGames) {
      let { game, inviteCode } = gameInfo;
      let { started, completed } = game;
      let buttons = [];
      buttons.push(
        (started)
          ? <button className="btn" key={ `open${ game.id }` } value={ game.id } onClick={ gameOptionOnClick } dir="">Open</button>
          : <button className="btn" key={ `start${ game.id }` } value={ game.id } onClick={ startOnClick }>Start</button>
      );
      if (!completed) {
        buttons.push(
          <div className="btn-group" key={ `request${ game.id }` }>
            <button className="btn" value={ game.id } onClick={ gameOptionOnClick } dir="/members">
              Members
            </button>
            <div className="tooltip tooltip-info" data-tip="Copy invite Link">
              <button className="btn btn-link" onClick={ copyInviteOnClick } value={ inviteCode }>🖅</button>
            </div>
          </div>
        );
        buttons.push(
          <button className="btn" key={ `edit${ game.id }` } value={ game.id } onClick={ gameOptionOnClick }
                  dir="/edit">Edit</button>
        );
      }

      elementList.push(
        <div key={ game.id } className="w-full h-14 mt-5 center border">
          <div className="w-1/4 center vertical border">
            <span className="w-1/3 mx-2">Name:</span>
            <span className="w-2/3 mx-2">{ game.name }</span>
          </div>
          <div className="w-1/8 center vertical border">
            <span className="w-2/3 mx-2">Player Count:</span>
            <span className="w-1/3 mx-2">{ game.members.length }/{ game.playerMax }</span>
          </div>
          <div className="w-1/2 center">
            { buttons }
          </div>
        </div>
      );
    }

    return (activeGames.dmGames.length > 0) && elementList;
  }
  const generatePlayerList = () => {
    let elementList = [
      <h1 key="DMGamestitle" className="w-full text-center text-3xl mt-5">Player Games</h1>,
    ]
    for (let game of activeGames.playerGames) {
      let { started, completed } = game;

      elementList.push(
        <div key={ game.id } className="w-full h-14 mt-5 center border">
          <div className="w-2/3 flex">

            <div className="w-1/3 center vertical border">
              <span className="w-1/3 mx-2">Name:</span>
              <span className="w-2/3 mx-2">{ game.name }</span>
            </div>
            <div className="w-1/3 center vertical border">
              <span className="w-1/3 mx-2">DM:</span>
              <span className="w-2/3 mx-2">{ game.uName }</span>
            </div>
            <div className="w-1/3 center vertical border">
              <span className="w-2/3 mx-2">Player Count:</span>
              <span className="w-1/3 mx-2">{ game.members.length }/{ game.playerMax }</span>
            </div>
          </div>
          <div className="w-1/3 center">
            { (started)
              ? <button className="btn" value={ game.id } onClick={ gameOptionOnClick } dir="">Open</button>
              : <div className="tooltip info" key={ `start${ game.id }` } data-tip="Game has yet to start.">
                <button className="btn" value={ game.id } disabled={ true }>Open</button>
              </div> }
            <button className="btn" value={ game.id } onClick={ gameOptionOnClick }>Leave</button>
          </div>
        </div>
      );
    }
    return (activeGames.playerGames.length > 0) && elementList;
  }

  return (
    <PageLayout title="Your Active Games" backHref="/home">
      { (activeGames) ? generateDmList() : <LoadingUi/> }
      { (activeGames) && generatePlayerList() }
    </PageLayout>
  )
}