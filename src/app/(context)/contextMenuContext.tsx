'use client';
import {
    createContext,
    CSSProperties,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useMemo,
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
// The setter alone never changes, so components that only open the menu (every chat message)
// don't re-render each time the menu opens or closes.
const ContextMenuSetterContext = createContext<Dispatch<SetStateAction<ContextMenuState>> | null>(null);

export function ContextMenuProvider({children}: { children: ReactNode }) {
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        clicked: false,
    });

    useEffect(() => {
        const handleClick = () => {
            // Keep the same state object when already closed, so clicks don't re-render
            setContextMenu((prev) => prev.clicked ? {clicked: false} : prev);
        }
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        }
    }, [])

    const value = useMemo(() => ({contextMenu, setContextMenu}), [contextMenu]);

    return (
        <ContextMenuContext.Provider value={value}>
          <ContextMenuSetterContext.Provider value={setContextMenu}>
            {contextMenu.clicked &&
              <ul className={`pseudo-input context-menu absolute z-40`} style={contextMenu.style}>
                  {contextMenu.options}
              </ul>
            }
            {children}
          </ContextMenuSetterContext.Provider>
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

export function useContextMenuSetter() {
    const setContextMenu = useContext(ContextMenuSetterContext);
    if (!setContextMenu) {
        throw new Error('useContextMenuSetter must be used within a ContextMenuProvider');
    }
    return setContextMenu;
}
