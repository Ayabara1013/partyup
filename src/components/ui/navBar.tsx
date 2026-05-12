'use client'

import Link from 'next/link';
import {ReactNode, RefObject, useRef} from "react";
import {dirHref} from "@/lib/routing/directoy";
import {useAuthManager} from "@/app/(context)/authContext";

export default function NavBar() {
    const profileRef: RefObject<any> = useRef(null);
    const {user, signOut} = useAuthManager()

    function logOutOnClick() {
        signOut()
    }

    function closeProfile() {
        profileRef.current.focus();
    }

    return (
        <div className="navbar bg-neutral z-10 shrink-0">
            <div tabIndex={1} className="navbar-start" ref={profileRef}>
                <Link href={dirHref.home} className="btn btn-ghost normal-case text-xl">PartyUp</Link>
            </div>

            <div className='navbar-center'>
                <div className='navbar-center hidden lg:flex'>
                    <ul className='menu menu-horizontal px-1 flex flex-row flex-wrap gap-4'>
                        <NavLink href={``} className={''}>play</NavLink>
                        <NavLink href={dirHref.discover}>discover</NavLink>
                        <NavLink href={dirHref.games.root}>Your Games</NavLink>
                    </ul>
                </div>
            </div>

            <div className="navbar-end ">
                <div className="dropdown dropdown-end">
                    <NavBarAvatar src={user ? "/images/038-adventure-1.png" : "/images/008-spellbook-1.png"}
                                  tabIndex={0} onClick={closeProfile}/>
                    <ul tabIndex={-1}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 ">
                        {user
                            ? <>
                                <li><Link href={dirHref.home} onClick={closeProfile}>{user.userMetadata.name} (Your
                                    Profile)</Link></li>
                                <li><Link href={dirHref.user.settings} onClick={closeProfile}>Settings</Link></li>
                                <li><Link href={dirHref.home} onClick={logOutOnClick}>LogOut</Link></li>
                            </>
                            : <li><Link href={dirHref.user.signin} onClick={closeProfile}>LogIn</Link></li>
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}


function NavLink({className, text, href = 'dir.error', children, ...props}: {
    className?: string,
    text?: string,
    href?: string,
    children?: ReactNode
}) {
    return (
        <li className={``}>
            <div className='p-0'>
                <Link className={`btn btn-secondary whitespace-nowrap min-w-[6rem] ${className}`}
                      href={href}>{text || children || 'BANANA'}</Link>
            </div>
        </li>
    )
}

function NavBarAvatar({src, onClick, tabIndex}: {
    src: string | Blob | undefined,
    onClick?: () => void,
    tabIndex: number
}) {
    return (
        <label className="btn btn-ghost btn-circle avatar">
            <div tabIndex={tabIndex} className="w-10 rounded-full" role="button">
                <img src={src}/>
            </div>
        </label>
    )
}