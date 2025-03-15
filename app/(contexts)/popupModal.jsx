'use client';
import {createContext, useContext, useRef, useState} from 'react';

const ModalContext = createContext(null);

export function ModalProvider({children}) {
  const [modalChildren, setModalChildren] = useState(null);
  const modalRef = useRef(null);
  const titleRef = useRef(null);

  function showModal() {
    modalRef.current.showModal();
  }

  function setTitle(title) {
    titleRef.current.innerHTML = title;
  }

  return (
    <ModalContext.Provider value={{showModal, setTitle, setModalChildren}}>
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
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}