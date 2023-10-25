import { toastUser } from "@/util/functions";
import toast from "react-hot-toast";

export default function PlayerMessageOptions({ message }) {
  async function copyOnClick() {
    let text = message.text;
    await navigator.clipboard.writeText(text);
    toast.success('Message Copied');
  }

  return (
    <>
      <li className="text-center btn btn-xs" onClick={copyOnClick}>
        Copy Message Text
      </li>
    </>
  )
}