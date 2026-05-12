import {GameManagerProvider} from "@/app/(context)/gameCreationEditorContext";
import {ReactNode} from "react";

export default function Layout({children}: { children: ReactNode }) {
    return (
        <GameManagerProvider>
            {children}
        </GameManagerProvider>
    )
}