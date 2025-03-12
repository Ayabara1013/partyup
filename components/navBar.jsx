'use client'
// @refresh reset
import {useRouter} from "next/navigation";

import Link from 'next/link';
import dir from '@/javascript/assets/directory';

import {useApplication} from "@app/(contexts)/application";
import {googleSignInPopUp, userAuth} from "@/javascript/firebase/base";
import {useState} from "react";

const styles = {
  navitem: '',
}


export default function NavBar(props) {
  const {push} = useRouter();
  const [refreshNav, setRefreshNav] = useState(false);

  function logOutOnClick() {
    push('/')
    userAuth.signOut()
    setRefreshNav(!refreshNav);
  }

  return (
    <div className="navbar bg-neutral z-10 ">
      <NavbarStart/>
      <NavbarCenter/>
      <NavbarEnd logOutOnClick={logOutOnClick}/>
    </div>
  )
}

function NavbarStart(props) {
  // const { item } = props;

  return (
    <div className="navbar-start ">

      <div className="dropdown">
        <label tabIndex={0} className="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
               stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16"/>
          </svg>
        </label>

        <ul tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><Link href={dir.home}>Discover</Link></li>
          <li><Link href={dir.games.root}>Games</Link></li>
          <li>
            <Link href={dir.home}>Create</Link>
            <ul className="p-2">
              <li><Link href={dir.home}>Character</Link></li>
              <li><Link href={dir.home}>World</Link></li>
            </ul>
          </li>
          <li><Link href={dir.home}>Settings</Link></li>
        </ul>
      </div>

      <Link href={dir.home} className="btn btn-ghost normal-case text-xl">PartyUp</Link>
    </div>
  )
}

function NavbarCenter() {
  return (
    <div className='navbar-center'>
      <div className='lg:hidden'>
        <button className='btn btn-secondary whitespace-nowrap'><Link href={dir.play}>play now</Link></button>
      </div>

      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1 flex flex-row flex-wrap gap-4'>
          <NavLink href={dir.play}>play</NavLink>
          <NavLink href={dir.discover}>discover</NavLink>
          <NavLink href={'/games'}>Games</NavLink>
          <NavLink href={dir.user.settings}>tools</NavLink>
        </ul>
      </div>
    </div>
  )
}

export function NavbarEnd({logOutOnClick}) {
  let {userDetails} = useApplication();
  return (
    <div className="navbar-end ">
      {/* <a className="btn">Button</a> */}
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src={
              userDetails ? "/images/038-adventure-1.png" : "/images/008-spellbook-1.png"
            }/>
          </div>
        </label>
        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          {userDetails
            ?
            <>
              <li>
                <Link href={dir.home} className="justify-between">
                  Your Profile{userDetails ? ` (${userDetails.displayName})` : ``}
                  <span className="badge">New</span>
                </Link>
              </li>
              <li><Link href={dir.user.settings}>Settings</Link></li>
              <li>
                <button onClick={logOutOnClick}>LogOut</button>
              </li>
            </>
            :
            <li>
              <button onClick={googleSignInPopUp}>LogIn</button>
            </li>}

        </ul>

      </div>
    </div>

  )
}

function NavLink({buttonClasses, className, text, href = 'dir.error', children, ...props}) {

  return (
    <li className={styles.navitem}>
      <div className='p-0'>
        <Link className={`btn btn-secondary whitespace-nowrap min-w-[6rem] ${className}`}
              href={href}>{text || children || 'BANANA'}</Link>
      </div>
    </li>
  )
}
