import { fbInGameManagement } from "@/javascript/firebase/fbInGameManagement";
import toast from "react-hot-toast";

export default function DmMessageOptions({ message, gameId }) {

  async function addCanonOnClick() {
    await fbInGameManagement.message.dm.addCanon(gameId, message.id);
    toast.success('Message Added to Canon');
  }

  async function removeCanonOnClick() {
    await fbInGameManagement.message.dm.removeCanon(gameId, message.id);
    toast.success('Message Removed from Canon');
  }

  return (
    <>
      <li/>
      {(message.window === 'init' || message.window === 'canon') ? (message.canon)
          ? <li className="text-center btn btn-xs" onClick={removeCanonOnClick}>Remove from Canon</li>
          : <li className="text-center btn btn-xs" onClick={addCanonOnClick}>Add to Canon</li>
        : null}
    </>
  )
}