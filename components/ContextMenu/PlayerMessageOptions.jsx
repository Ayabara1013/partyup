import { toastUser } from "@/util/functions";

export default function PlayerMessageOptions ({message}) {
    async function copyOnClick(){
        let text = message.text;
        await navigator.clipboard.writeText(text);
        toastUser('Message Copied', 'success');
    }

    return (
        <>
            <li className="text-center btn btn-xs" onClick={copyOnClick}>
                Copy Message Text
            </li>
        </>
    )
}