import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useApplication} from "@app/(contexts)/application";
import {fbPlayerManagement} from "@/javascript/firebase/fbPlayerManagement";
import toast from "react-hot-toast";
import {dirHref} from "@/javascript/assets/directoryHref";
import PageLayout from "@components/pageLayout";
import LoadingUi from "@components/loadinUi";

export default function BaseInvitePage({gameId, inviteCode, errorMessage}) {
  const {push} = useRouter();
  const [game, setGame] = useState(null);
  const {userDetails} = useApplication();

  useEffect(() => {
    if(inviteCode){
      fbPlayerManagement.general.get.gameFromInvite(gameId, inviteCode).then(doc => {
        if (!doc) {
          toast.error(errorMessage)
          push(dirHref.games.root)
          return;
        }
        setGame(doc)
      });
    } else{
      fbPlayerManagement.general.get.gameFromId(gameId).then(doc => {
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
    let result = await fbPlayerManagement.general.joinGame(userDetails, gameId, inviteCode);
    if (result) {
      toast.success("Join request sent.");
    } else{
      toast.error("Error joining game.");
    }
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
            <h2 className="w-3/4 flex mt-4 px-2 border">{game.uName}</h2>
          </div>
          <div className="w-full flex flex-col px-2">
            <h2 className="w-full flex mt-4 px-2 border">Players:</h2>
            <div className="w-full flex flex-col mt-4 px-2 border">
              {/*  {game.members.map(member =>*/}
              {/*    <div key={member.id} className="w-full flex mt-2">{member.uName}</div>*/}
              {/*  )}*/}
              {/*  {(game.members.length === 0) && <div className="w-full flex mt-2">No players yet!</div>}*/}
            </div>
            <button className="btn mt-5" onClick={joinGame}>Join Game!</button>
          </div>
        </>
        : <LoadingUi/>}
    </PageLayout>
  )
}