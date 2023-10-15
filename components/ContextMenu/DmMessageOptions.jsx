import { toastUser } from "@/util/functions";
import { messaging } from "@/firebase/messaging";

export default function PlayerMessageOptions({ message, gameId }) {

  async function addCanonOnClick() {
    await messaging.init.addCanon(gameId, message.id);
    toastUser('Message Added to Canon', 'success');
  }

  async function removeCanonOnClick() {
    await messaging.init.removeCanon(gameId, message.id);
    toastUser('Message Removed from Canon', 'success');
  }

  return (
    <>
      <li></li>
      { (message.canon !== undefined) && (message.canon)
        ? <li className="text-center btn btn-xs" onClick={ removeCanonOnClick }>Remove from Canon</li>
        : <li className="text-center btn btn-xs" onClick={ addCanonOnClick }>Add to Canon</li> }
    </>
  )
}