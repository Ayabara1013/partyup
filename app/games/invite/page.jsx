import { redirect } from "next/navigation";
import {dirHref} from "@/javascript/assets/directoryHref";

export default function Page() {
  redirect(dirHref.games.root);
}