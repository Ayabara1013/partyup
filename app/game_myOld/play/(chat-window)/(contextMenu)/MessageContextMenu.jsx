import Player from "@app/game_myOld/play/(chat-window)/(contextMenu)/(options)/player";
import { userAuth } from "@/javascript/firebase/base";
import DmMessageOptions from "@app/game_myOld/play/(chat-window)/(contextMenu)/(options)/dm";

export default function MessageContextMenu({ message, game }) {
  return (
    <>
      <Player message={message}/>
      {(userAuth.currentUser.uid === game.uid && message.canon !== undefined) &&
        <DmMessageOptions message={message} gameId={game.id}/>}
    </>
  )
}