import PlayerMessageOptions from "@/components/ContextMenu/PlayerMessageOptions";
import { userAuth } from "@/firebase/base";
import DmMessageOptions from "@/components/ContextMenu/DmMessageOptions";


export default function MessageContextMenu({ message, game }) {
  return (
    <>
      <PlayerMessageOptions message={message}/>
      {(userAuth.currentUser.uid === game.uid && message.canon !== undefined) &&
        <DmMessageOptions message={message} gameId={game.id}/>}
    </>
  )
}