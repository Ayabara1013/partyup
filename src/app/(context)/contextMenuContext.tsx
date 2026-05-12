'use client';
import {
    createContext,
    CSSProperties,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState
} from "react";

type ContextMenuState = {
    clicked: boolean;
    style?: CSSProperties;
    options?: ReactNode;
};
type ContextMenuContextType = {
    contextMenu: ContextMenuState;
    setContextMenu: Dispatch<SetStateAction<ContextMenuState>>;
};

const ContextMenuContext = createContext<ContextMenuContextType | null>(null);

export function ContextMenuProvider({children}: { children: ReactNode }) {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        clicked: false,
    });

    useEffect(() => {
        const handleClick = () => {
            setContextMenu({clicked: false});
        }
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        }
    }, [])

    return (
        <ContextMenuContext.Provider value={{contextMenu, setContextMenu}}>
            {contextMenu.clicked &&
              <ul className={`pseudo-input absolute z-40 `} style={contextMenu.style}>
                  {contextMenu.options}
              </ul>
            }
            {children}
        </ContextMenuContext.Provider>
    );
}

export function useContextMenu() {
    const context = useContext(ContextMenuContext);
    if (!context) {
        throw new Error('useContextMenu must be used within a ContextMenuProvider');
    }
    return context;
}