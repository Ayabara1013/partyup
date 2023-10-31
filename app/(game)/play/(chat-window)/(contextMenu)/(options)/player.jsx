import toast from "react-hot-toast";
import { editorTools } from "@/components/slatejs/(util)/editorUtil";

export default function PlayerMessageOptions({ message }) {
  async function copyOnClick() {
    let messageObject = JSON.parse(message.text);
    await navigator.clipboard.writeText(editorTools.printValues(messageObject));
    toast.success('Message Copied (Plain Text)');
  }

  return (
    <>
      <li className="text-center btn btn-xs" onClick={copyOnClick}>Copy Message Text</li>
    </>
  )
}