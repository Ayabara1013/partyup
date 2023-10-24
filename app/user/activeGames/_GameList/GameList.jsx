import { useRouter } from "next/navigation";

import { baseUrl } from "@/util/constants";
import { userAuth } from "@/firebase/base";
import { fbManagement } from "@/firebase/fbManagement";
import { accountLocalStorage } from "@/util/localStorage";
import GameStat from "@/app/user/activeGames/_GameList/GameListStat";
import toast from "react-hot-toast";

export default function GameList({ games }) {
  const { push } = useRouter();
  const dm = (games) ? games[0]?.uid === userAuth.currentUser.uid : false;
  const gameOnClick = (path) => {
    return async (e) => {
      let gameId = e.target.value;
      for (let game of games) {
        if (game.id === gameId) {
          accountLocalStorage.setCurrentGame(userAuth.currentUser.uid, gameId);
          if (path === 'start/') {
            await fbManagement.dm.startGame(gameId);
            toast.success(`'${ game.name }' has started!`);
            path = '';
          }
          accountLocalStorage.setCurrentGame(userAuth.currentUser.uid, false);
          push(`/game/${ path + gameId }`);
          return;
        }
      }
    }
  }
  const copyInviteOnClick = async (e) => {
    await navigator.clipboard.writeText(`${ baseUrl }invite/${ e.target.value }`);
    toast.success('Invite code copied to clipboard.');
  }

  return games.map(game =>
    <div key={ game.id } className="bg-base-200 border">
      <div className="collapse-title text-xl font-medium">
        { game.name }
      </div>

      <div className="stats w-full overflow-hidden border">
        <GameStat title="Description:" values={[game.description]}/>
        <GameStat title="Players:" values={[`${game.members.length }/${ game.maxPlayers}`]}>
          { dm &&
            <div className="join">
              <button className="btn btn-xs join-item" value={ game.id } onClick={ gameOnClick('members/') }>
                Check Players
              </button>
              <div className="tooltip tooltip-info" data-tip="Copy invite Link">
                <button className="btn btn-xs btn-active join-item" onClick={ copyInviteOnClick }
                        value={ game.inviteCode }>🖅
                </button>
              </div>
            </div>
          }
        </GameStat>
        <GameStat title="Acts/Chapters:" values={[
          game.hasActs ? `Act:${ game.currentAct }` : 'No Acts',
          game.hasChapters ? `Chapter:${ game.currentChapter }` : 'No Chapters'
        ]}>
        </GameStat>
        <GameStat>
          { game.started
            ? <button className="btn btn-sm mt-2" value={ game.id } onClick={ gameOnClick('') }>Open</button>
            : dm
              ? <button className="btn btn-sm mt-2" value={ game.id } onClick={ gameOnClick('start/') }>Start</button>
              : <button className="btn btn-sm mt-2" value={ game.id } disabled>Waiting on Dm..</button>
          }
          { dm && <button className="btn btn-sm mt-2" value={ game.id } onClick={ gameOnClick('edit/') }>Edit</button> }
        </GameStat>
      </div>
    </div>
  )
}
