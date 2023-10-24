import { toastUser } from "@/util/functions";
import { messaging } from "@/firebase/messaging";
import toast from "react-hot-toast";

export default function PlayerMessageOptions({ message, gameId }) {

  async function addCanonOnClick() {
    await messaging.game.addCanon(gameId, message.id);
    toast.success('Message Added to Canon');
  }

  async function removeCanonOnClick() {
    await messaging.game.removeCanon(gameId, message.id);
    toast.success('Message Removed from Canon');
  }

  return (
    <>
      <li/>
      { (message.window === 'init' || message.window === 'canon')?(message.canon)
          ? <li className="text-center btn btn-xs" onClick={ removeCanonOnClick }>Remove from Canon</li>
          : <li className="text-center btn btn-xs" onClick={ addCanonOnClick }>Add to Canon</li>
        :null }
    </>
  )
}