'use client';
import {
    createContext,
    CSSProperties,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState
} from "react";
import {editMenu, findEditable} from "@/components/ui/editContextMenu";

// Space kept between an open menu and the window's bottom and right edges
const MENU_EDGE_GAP_PX = 8;

// Whether a click leaves the menu open: it went through a part marked data-menu-keep-open (a step that needs more
// clicks), or landed on the menu's own background while it shows such a part. The path is fixed when the click
// starts, so this still holds after the click re-drew that part.
function keepsMenuOpen(e: MouseEvent, menu: HTMLElement | null) {
    if (!menu) return false;
    const path = e.composedPath();
    if (!path.includes(menu)) return false;
    if (path[0] === menu) return !!menu.querySelector(`[data-menu-keep-open]`);
    return path.some((n) => n instanceof Element && n.hasAttribute(`data-menu-keep-open`));
}

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
    const menuRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (keepsMenuOpen(e, menuRef.current)) return;
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

    // Escape closes an open menu, and only the menu: caught on window in the capture phase, before the message
    // editor, Pinned Messages, the player card or the character creator see it
    useEffect(() => {
        if (!contextMenu.clicked) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key !== `Escape`) return;
            e.stopPropagation();
            e.preventDefault();
            setContextMenu({clicked: false});
        };
        window.addEventListener(`keydown`, onKey, true);
        return () => window.removeEventListener(`keydown`, onKey, true);
    }, [contextMenu.clicked]);

    // Keeps the open menu inside the window: after it renders, and whenever its size changes (a step opening), it
    // moves up or left by as much as it passes the bottom or right edge, never past the top or left one. Callers
    // keep passing the click position.
    useLayoutEffect(() => {
        const menu = menuRef.current;
        if (!contextMenu.clicked || !menu) return;
        const fit = () => {
            menu.style.translate = ``;
            const r = menu.getBoundingClientRect();
            const dx = Math.max(-r.left, Math.min(0, window.innerWidth - MENU_EDGE_GAP_PX - r.right));
            const dy = Math.max(-r.top, Math.min(0, window.innerHeight - MENU_EDGE_GAP_PX - r.bottom));
            menu.style.translate = `${dx}px ${dy}px`;
        };
        const observer = new ResizeObserver(fit);
        observer.observe(menu);
        fit();
        return () => observer.disconnect();
    }, [contextMenu]);

    return (
        <ContextMenuSetterContext.Provider value={setContextMenu}>
            {contextMenu.clicked &&
              <ul ref={menuRef} className={`pseudo-input context-menu absolute z-40`} style={contextMenu.style}>
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
