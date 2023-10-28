'use client';
import { useEffect, useState } from "react";

import GameList from "./_game-list";

import { useApplicationContext } from "@/app/ApplicationContext";

import { ui } from "@/javascript/ui";

export default function Page() {
  const [ activeTab, setActiveTab ] = useState(null);
  const { activeGames } = useApplicationContext();

  useEffect(() => {
    (activeGames?.dmGames.length > 0) ? setActiveTab('dm') : setActiveTab('player');
  }, [ activeGames ]);

  useEffect(() => {
    ui.user.activeGames.dmTab.element().classList[(activeTab === 'dm') ? 'add' : 'remove']('tab-active');
    ui.user.activeGames.playerTab.element().classList[(activeTab === 'player') ? 'add' : 'remove']('tab-active');
  }, [ activeTab ]);

  const setTab = (e) => {
    setActiveTab(e.target.value);
  }

  return (
    <div className='home-page w-full h-full border'>
      <div className="tabs">
        <button className="tab tab-lg tab-lifted" id={ui.user.activeGames.dmTab.id} value="dm" onClick={setTab}>Games as
          DM - {activeGames?.dmGames.length}</button>
        <button className="tab tab-lg tab-lifted" id={ui.user.activeGames.playerTab.id} value="player"
                onClick={setTab}>Games as Player - {activeGames?.playerGames.length}</button>
      </div>
      <div className="h-full border overflow-y-auto">
        {(activeGames && activeTab === 'dm') && <GameList games={activeGames?.dmGames}/>}
        {(activeGames && activeTab === 'player') && <GameList games={activeGames?.playerGames}/>}
      </div>
    </div>
  )
}