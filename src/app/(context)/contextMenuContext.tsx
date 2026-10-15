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
import {editMenu, findEditable} from "@/components/ui/editContextMenu";

type ContextMenuState = {
    clicked: boolean;
    style?: CSSProperties;
    options?: ReactNode;
};
// Only the setter is shared: it never changes, so components that open the menu (every chat message)
// don't re-render each time the menu opens or closes. The provider alone renders the menu.
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
        // The one right-click listener for the app: the browser's own menu is never shown, only custom menus.
        // React's onContextMenu handlers run first (they're attached below document).
        const blockBrowserMenu = (e: MouseEvent) => {
            // Text fields and the chat editor always get Cut / Copy / Paste, even inside something with its own menu
            const editable = findEditable(e.target);
            if (editable) {
                e.preventDefault();
                setContextMenu(editMenu(editable, e.clientX, e.clientY));
                return;
            }
            // A handler that opened a custom menu called e.preventDefault(). Otherwise this spot has no custom menu:
            // block the browser menu and close any custom menu that's still open.
            if (e.defaultPrevented) return;
            e.preventDefault();
            setContextMenu((prev) => prev.clicked ? {clicked: false} : prev);
        };
        window.addEventListener('click', handleClick);
        document.addEventListener('contextmenu', blockBrowserMenu);
        return () => {
            window.removeEventListener('click', handleClick);
            document.removeEventListener('contextmenu', blockBrowserMenu);
        }
    }, [])

    return (
        <ContextMenuSetterContext.Provider value={setContextMenu}>
            {contextMenu.clicked &&
              <ul className={`pseudo-input context-menu absolute z-40`} style={contextMenu.style}>
                  {contextMenu.options}
              </ul>
            }
            {children}
        </ContextMenuSetterContext.Provider>
    );
}

export function useContextMenuSetter() {
    const setContextMenu = useContext(ContextMenuSetterContext);
    if (!setContextMenu) {
        throw new Error('useContextMenuSetter must be used within a ContextMenuProvider');
    }
    return setContextMenu;
}
