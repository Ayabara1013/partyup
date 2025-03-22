import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useAccountManager} from "@app/(contexts)/accountManager";
import {fbPlayerManager} from "@/javascript/firebase/managers/fbPlayerManager";
import toast from "react-hot-toast";
import {dirHref} from "@/javascript/assets/directoryHref";
import PageLayout from "@components/pageLayout";
import LoadingUi from "@components/loadinUi";

export default function BaseInvitePage({gameId, inviteCode, errorMessage}) {
  const {push} = useRouter();
  const [game, setGame] = useState(null);
  const {userDetails} = useAccountManager();

  useEffect(() => {
    if (inviteCode) {
      fbPlayerManager.general.get.game.fromInvite(gameId, inviteCode).then(doc => {
        if (!doc) {
          toast.error(errorMessage)
          push(dirHref.games.root)
          return;
        }
        setGame(doc)
      });
    } else {
      fbPlayerManager.general.get.game.fromId(gameId).then(doc => {
        if (!doc) {
          toast.error(errorMessage)
          push(dirHref.games.root)
          return;
        }
        setGame(doc)
      });
    }
  }, []);

  async function joinGame() {
    await fbPlayerManager.general.joinGame(gameId, inviteCode);
    setTimeout(()=>{
      push(dirHref.games.root)
    }, 1500)
  }

  return (
    <PageLayout title={`Join Game: ${game?.name}`} backHref={dirHref.games.root}>
      {(game) ?
        <>
          <div className="w-full center px-2">
            <h2 className="w-1/4 flex mt-4 px-2 border">Game Description:</h2>
            <h2 className="w-3/4 flex mt-4 px-2 border">{game.description}</h2>
          </div>
          <div className="w-full center px-2">
            <h2 className="w-1/4 flex mt-4 px-2 border">DM:</h2>
            <h2 className="w-3/4 flex mt-4 px-2 border">{game.gm.uName}</h2>
          </div>
          <div className="w-full flex flex-col px-2">
            <h2 className="w-full flex mt-4 px-2 border">Players:</h2>
            <div className="w-full flex flex-col mt-4 px-2 border">
              {/*  {game.players.map(member =>*/}
              {/*    <div key={member.id} className="w-full flex mt-2">{member.uName}</div>*/}
              {/*  )}*/}
              {/*  {(game.players.length === 0) && <div className="w-full flex mt-2">No players yet!</div>}*/}
            </div>
            <button className="btn mt-5" onClick={joinGame}>Join Game!</button>
          </div>
        </>
        : <LoadingUi/>}
    </PageLayout>
  )
}