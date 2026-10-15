'use client';
import {createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useMemo, useRef, useState} from 'react';

type PopupModalContextType = {
    showModal: () => void;
    hideModal: () => void;
    setTitle: Dispatch<SetStateAction<string>>;
    setModalChildren: Dispatch<SetStateAction<ReactNode>>;
};

const PopupModalContext = createContext<PopupModalContextType | null>(null);

export function PopupModalProvider({children}: { children: ReactNode }) {
    const [modalChildren, setModalChildren] = useState<ReactNode>(null);
    const [title, setTitle] = useState(``);
    const modalRef = useRef<HTMLDialogElement>(null);

    const showModal = useCallback(() => modalRef.current?.showModal(), []);
    const hideModal = useCallback(() => modalRef.current?.close(), []);

    // The functions never change, so opening the modal or changing its content doesn't re-render consumers
    const value = useMemo(
        () => ({showModal, hideModal, setTitle, setModalChildren}),
        [showModal, hideModal]
    );

    return (
        <PopupModalContext.Provider value={value}>
            <dialog ref={modalRef} className={`modal`}>
                <div className={`modal-box`}>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h1 className={`font-bold text-2xl`}>{title}</h1>
                    {modalChildren}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            {children}
        </PopupModalContext.Provider>
    )
}

export function usePopupModal() {
    const context = useContext(PopupModalContext);
    if (!context) {
        throw new Error('usePopupModal must be used within a PopupModalProvider');
    }
    return context;
}
