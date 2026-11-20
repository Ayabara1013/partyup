'use client'

import Link from 'next/link';
import {usePathname} from "next/navigation";
import {ReactNode, useEffect, useRef} from "react";
import {dirHref} from "@/lib/routing/directoy";
import {useAuthManager} from "@/app/(context)/authContext";
import Avatar from "@/components/ui/avatar";

const NAV_LINKS = [
    {href: dirHref.discover, label: `Discover`},
    {href: dirHref.games.root, label: `Your Games`},
];

const BRAND = `PartyUp`;
// A game's own pages show its name in the bar and the tab
const GAME_PAGE_RE = /^\/games\/(?:play|edit)\/([^/]+)/;
// Long names: show the start, slide to the end, pause, jump back
const SCROLL_HOLD_START_MS = 2000;
const SCROLL_HOLD_END_MS = 1000;
const SCROLL_PX_PER_SECOND = 40;

type NamedGame = { id: string, name?: string };

export default function NavBar() {
    const {user, signOut, gmGames, playerGames} = useAuthManager()
    const pathname = usePathname();
    const gameName = gamePageName(pathname, gmGames, playerGames);

    // The tab shows the game too; the layout's "PartyUp" comes back when leaving
    useEffect(() => {
        if (!gameName) return;
        const previous = document.title;
        document.title = `${gameName} | ${BRAND}`;
        return () => {
            document.title = previous;
        };
    }, [gameName]);

    // Daisy dropdowns stay open while focused; blurring closes them after a choice
    function closeMenu() {
        (document.activeElement as HTMLElement | null)?.blur();
    }

    return (
        <nav className="app-nav navbar">
            <div className="navbar-start">
                <NavBrand gameName={gameName}/>
            </div>

            <div className='navbar-center hidden lg:flex'>
                <ul className='flex items-center gap-1'>
                    {NAV_LINKS.map((link) =>
                        <NavLink key={link.label} href={link.href} active={!!link.href && pathname.startsWith(link.href)}>
                            {link.label}
                        </NavLink>
                    )}
                </ul>
            </div>

            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <NavBarAvatar name={user?.userMetadata?.name}
                                  src={user?.userMetadata?.avatarUrl ?? user?.userMetadata?.picture}/>
                    <ul tabIndex={-1} className="app-nav__menu menu dropdown-content popup-surface">
                        {user
                            ? <>
                                <li className="menu-title">{user.userMetadata.name}</li>
                                {/* The page links live here on small screens */}
                                {NAV_LINKS.map((link) =>
                                    <li key={link.label} className="lg:hidden">
                                        <Link href={link.href} onClick={closeMenu}>{link.label}</Link>
                                    </li>
                                )}
                                <li><Link href={dirHref.user.profile} onClick={closeMenu}>Your Profile</Link></li>
                                <li><Link href={dirHref.user.settings} onClick={closeMenu}>Settings</Link></li>
                                <li><Link href={dirHref.home} onClick={() => { closeMenu(); signOut(); }}>Log Out</Link></li>
                            </>
                            : <li><Link href={dirHref.user.signin} onClick={closeMenu}>Log In</Link></li>
                        }
                    </ul>
                </div>
            </div>
        </nav>
    )
}

// The game's name on its play and edit pages, from the lists the auth context already holds; null elsewhere,
// while the lists load, or for a game the visitor is not in
function gamePageName(pathname: string, gmGames: NamedGame[], playerGames: NamedGame[]) {
    const gameId = GAME_PAGE_RE.exec(pathname)?.[1];
    if (!gameId) return null;
    const game = gmGames.find((g) => g.id === gameId) ?? playerGames.find((g) => g.id === gameId);
    return game?.name || null;
}

// "PartyUp", or the game's name. A name wider than its space scrolls (SCROLL_*); with reduced motion it is cut off
// with an ellipsis instead. The state sits on the link as data-scrolling, which the stylesheet reads.
function NavBrand({gameName}: { gameName: string | null }) {
    const linkRef = useRef<HTMLAnchorElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const link = linkRef.current;
        const text = textRef.current;
        if (!link || !text) return;
        const reduceMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`);
        let animation: Animation | null = null;
        let distance = 0;
        let active = true;

        const update = () => {
            if (!active) return;
            const overflow = text.getBoundingClientRect().width - link.getBoundingClientRect().width;
            const next = reduceMotion.matches || overflow <= 0.5 ? 0 : Math.ceil(overflow);
            if (next === distance) return;
            distance = next;
            animation?.cancel();
            animation = null;
            link.toggleAttribute(`data-scrolling`, distance > 0);
            if (!distance) return;

            const slideMs = distance / SCROLL_PX_PER_SECOND * 1000;
            const totalMs = SCROLL_HOLD_START_MS + slideMs + SCROLL_HOLD_END_MS;
            const start = `translateX(0)`;
            const end = `translateX(-${distance}px)`;
            // Each repeat starts again at 0, which is the jump back
            animation = text.animate([
                {transform: start, offset: 0},
                {transform: start, offset: SCROLL_HOLD_START_MS / totalMs},
                {transform: end, offset: (SCROLL_HOLD_START_MS + slideMs) / totalMs},
                {transform: end, offset: 1},
            ], {duration: totalMs, iterations: Infinity});
        };

        const observer = new ResizeObserver(update);
        observer.observe(link);
        reduceMotion.addEventListener(`change`, update);
        document.fonts.ready.then(update); // the web font changes the name's width once it arrives
        update();
        return () => {
            active = false;
            observer.disconnect();
            reduceMotion.removeEventListener(`change`, update);
            animation?.cancel();
            link.removeAttribute(`data-scrolling`);
        };
    }, [gameName]);

    return (
        <Link ref={linkRef} href={dirHref.home} className="app-nav__brand"
              title={gameName ? `${BRAND} home` : undefined}>
            <span ref={textRef}>{gameName ?? BRAND}</span>
        </Link>
    );
}

function NavLink({href, active, children}: { href: string, active: boolean, children: ReactNode }) {
    return (
        <li>
            <Link className={`app-nav__link ${active ? `app-nav__link--active` : ``}`} href={href}
                  aria-current={active ? `page` : undefined}>
                {children}
            </Link>
        </li>
    )
}

// Same look as the chat avatars: the profile picture, or the name's initial on primary
function NavBarAvatar({name, src}: { name?: string, src?: string }) {
    return (
        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Account menu">
            <Avatar src={src} name={name} imageClassName="app-nav__avatar" fallbackClassName="app-nav__avatar app-nav__avatar--fallback"/>
        </div>
    )
}
