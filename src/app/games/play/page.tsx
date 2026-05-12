import {redirect} from "next/navigation";
import {dirHref} from "@/lib/routing/directoy";

export default function Play() {
    redirect(dirHref.games.root)
}
