'use client'

import Link from 'next/link';
import {usePathname} from "next/navigation";
import {ReactNode} from "react";
import {dirHref} from "@/lib/routing/directoy";
import {useAuthManager} from "@/app/(context)/authContext";

const NAV_LINKS = [
    {href: ``, label: `Play`},
    {href: dirHref.discover, label: `Discover`},
    {href: dirHref.games.root, label: `Your Games`},
];

export default function NavBar() {
    const {user, signOut} = useAuthManager()
    const pathname = usePathname();

    // Daisy dropdowns stay open while focused; blurring closes them after a choice
    function closeMenu() {
        (document.activeElement as HTMLElement | null)?.blur();
    }

    return (
        <nav className="app-nav navbar">
            <div className="navbar-start">
                <Link href={dirHref.home} className="app-nav__brand">PartyUp</Link>
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
                    <ul tabIndex={-1} className="app-nav__menu menu dropdown-content">
                        {user
                            ? <>
                                <li className="menu-title">{user.userMetadata.name}</li>
                                {/* The page links live here on small screens */}
                                {NAV_LINKS.map((link) =>
                                    <li key={link.label} className="lg:hidden">
                                        <Link href={link.href} onClick={closeMenu}>{link.label}</Link>
                                    </li>
                                )}
                                <li><Link href={dirHref.home} onClick={closeMenu}>Your Profile</Link></li>
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
            {src
                ? <img className="app-nav__avatar" src={src} alt="" referrerPolicy="no-referrer"/>
                : <div className="app-nav__avatar app-nav__avatar--fallback">{(name ?? `?`).charAt(0).toUpperCase()}</div>}
        </div>
    )
}
