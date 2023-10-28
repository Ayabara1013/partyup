import { useRouter } from "next/navigation";

import { baseUrl } from "@/javascript/constants";
import { userAuth } from "@/javascript/firebase/base";
import { accountLocalStorage } from "@/javascript/localStorage";
import GameStat from "@/app/(game)/my-games/_game-list/GameListStat";
import toast from "react-hot-toast";
import { fbManagement } from "@/javascript/firebase/fbManagement";

export default function GameList({ games }) {
  let { uid } = userAuth.currentUser;
  const { push } = useRouter();
  const dm = (games) ? games[0]?.uid === uid : false;

  const gameOnClick = (path) => {
    return async (e) => {
      let dmPage = [ 'edit', 'info' ];
      let gameId = e.target.value;
      if (dmPage.includes(path)) {
        accountLocalStorage.setEditGame(gameId);
        push(`/game-${path}`)
      } else {
        if (path === 'start') {
          await fbManagement.dm.startGame(gameId);
        }
        accountLocalStorage.setCurrentGame(gameId);
        push('/play')
      }
    }
  }
  const copyInviteOnClick = async (e) => {
    await navigator.clipboard.writeText(`${baseUrl}game-invite/${e.target.value}`);
    toast.success('Invite code copied to clipboard.');
  }

  return games.map(game =>
    <div key={game.id} className="bg-base-200 border">
      <div className="collapse-title text-xl font-medium">
        {game.name}
      </div>

      <div className="stats w-full overflow-hidden border">
        <GameStat title="Description:" values={[ game.description ]}/>
        <GameStat title="Players:" values={[ `${game.members.length}/${game.maxPlayers}` ]}>
          {dm &&
            <div className="join">
              <button className="btn btn-xs join-item" value={game.id} onClick={gameOnClick('info')}>
                Check Players
              </button>
              <div className="tooltip tooltip-info" data-tip="Copy invite Link">
                <button className="btn btn-xs btn-active join-item" onClick={copyInviteOnClick}
                        value={game.inviteCode}>🖅
                </button>
              </div>
            </div>
          }
        </GameStat>
        <GameStat title="Acts/Chapters:" values={[
          game.hasActs ? `Act:${game.currentAct}` : 'No Acts',
          game.hasChapters ? `Chapter:${game.currentChapter}` : 'No Chapters'
        ]}>
        </GameStat>
        <GameStat>
          {game.started
            ? <button className="btn btn-sm mt-2" value={game.id} onClick={gameOnClick('')}>Open</button>
            : dm
              ? <button className="btn btn-sm mt-2" value={game.id} onClick={gameOnClick('start')}>Start</button>
              : <button className="btn btn-sm mt-2" value={game.id} disabled>Waiting on Dm..</button>
          }
          {dm && <button className="btn btn-sm mt-2" value={game.id} onClick={gameOnClick('edit')}>Edit</button>}
        </GameStat>
      </div>
    </div>
  )
}
