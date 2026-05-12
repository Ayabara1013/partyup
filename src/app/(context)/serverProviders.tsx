"use client";

import {AuthManagerProvider} from "@/app/(context)/authContext";
import {PopupModalProvider} from "@/app/(context)/popupModalContext";
import {ContextMenuProvider} from "@/app/(context)/contextMenuContext";
import {ReactNode} from "react";

export default function Providers({children}: { children: ReactNode }) {
    return (
        <AuthManagerProvider>
            <PopupModalProvider>
                <ContextMenuProvider>
                    {children}
                </ContextMenuProvider>
            </PopupModalProvider>
        </AuthManagerProvider>
    );
}