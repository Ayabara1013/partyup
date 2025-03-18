'use client'
import {useRouter} from "next/navigation";

import Link from 'next/link';
import {dirHref} from '@/javascript/assets/directoryHref';

import {useAccountManager} from "@app/(contexts)/accountManager";
import {userAuth} from "@/javascript/firebase/base";
import {useState} from "react";

export default function NavBar() {
  let {userDetails} = useAccountManager();
  const {push} = useRouter();
  const [refreshNav, setRefreshNav] = useState(false);

  function logOutOnClick() {
    push(dirHref.home)
    userAuth.signOut()
    setRefreshNav(!refreshNav);
  }

  return (
    <div className="navbar bg-neutral z-10 ">
      <div className="navbar-start ">
        <Link href={dirHref.home} className="btn btn-ghost normal-case text-xl">PartyUp</Link>
      </div>

      <div className='navbar-center'>
        <div className='navbar-center hidden lg:flex'>
          <ul className='menu menu-horizontal px-1 flex flex-row flex-wrap gap-4'>
            <NavLink href={``}>play</NavLink>
            <NavLink href={dirHref.discover}>discover</NavLink>
            <NavLink href={dirHref.games.root}>Your Games</NavLink>
          </ul>
        </div>
      </div>

      <div className="navbar-end ">
        <div className="dropdown dropdown-end">
          <NavBarAvatar src={userDetails ? "/images/038-adventure-1.png" : "/images/008-spellbook-1.png"}/>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {userDetails
              ? <>
                <li><Link href={dirHref.home}>Your Profile {userDetails.uName}</Link></li>
                <li><Link href={dirHref.user.settings}>Settings</Link></li>
                <li><button onClick={logOutOnClick}>LogOut</button></li>
              </>
              : <li><Link href={dirHref.user.signin}>LogIn</Link></li>
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

function NavLink({buttonClasses, className, text, href = 'dir.error', children, ...props}) {
  return (
    <li className={``}>
      <div className='p-0'>
        <Link className={`btn btn-secondary whitespace-nowrap min-w-[6rem] ${className}`}
              href={href}>{text || children || 'BANANA'}</Link>
      </div>
    </li>
  )
}

function NavBarAvatar({src}) {
  return (
    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full ">
        <img src={src}/>
      </div>
    </label>
  )
}