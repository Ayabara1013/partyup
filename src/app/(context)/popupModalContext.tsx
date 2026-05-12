'use client';
import {createContext, Dispatch, ReactNode, RefObject, SetStateAction, useContext, useRef, useState} from 'react';

type PopupModalContextType = {
    showModal: () => void;
    setTitle: (title: string) => void;
    setModalChildren: any;
};

const PopupModalContext = createContext<PopupModalContextType | null>(null);


export function PopupModalProvider({children}: { children: ReactNode }) {
    const [modalChildren, setModalChildren] = useState(null);
    const modalRef: RefObject<any> = useRef(null);
    const titleRef: RefObject<any> = useRef(null);

    function showModal() {
        modalRef.current.showModal();
    }

    function setTitle(title: string) {
        titleRef.current.innerHTML = title;
    }

    return (
        <PopupModalContext.Provider value={{showModal, setTitle, setModalChildren}}>
            <dialog ref={modalRef} className={`modal`}>
                <div className={`modal-box`}>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h1 ref={titleRef} className={`font-bold text-2xl`}>Title here</h1>
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