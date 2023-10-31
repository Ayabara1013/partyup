'use client'

import { useRouter } from "next/navigation";

import Dir from "@/components/Dir";

import { googleSignInPopUp, userAuth } from "@/firebase/base";

import { ui } from "@/util/ui";
import Link from 'next/link';

export default function Navbar(props) {
  return (
    <div className="navbar bg-neutral z-10">

      <NavbarStart />
      <NavbarCenter />
      <NavbarEnd />
      
    </div>
  )
}



function NavbarStart(props) {
  // const { item } = props;

  return (
    <div className="navbar-start">

      <div className="dropdown">
        <label tabIndex={0} className="btn btn-ghost lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
        </label>

        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><Link href='/'>Discover</Link></li>
          <li><Link href='/'>Games</Link></li>
          <li>
            <Link href='/'>Create</Link>
            <ul className="p-2">
              <li><Link href='/'>Character</Link></li>
              <li><Link href='/'>World</Link></li>
            </ul>
          </li>
          <li><Link href='/'>Settings</Link></li>
        </ul>
      </div>

      <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
    </div>
  )
}

function NavbarCenter(props) {
  // const { item } = props;

  return (
    <div className="navbar-center hidden lg:flex">
      <ul className="menu menu-horizontal px-1">

        <li><Link href='/discover'>Discover</Link></li>
        <li><Link href='/play'>Play</Link></li>

        <li tabIndex={0}>
          <details>
            <summary>Create</summary>
            <ul className="p-2 bg-accent text-accent-content">
              <li>
                create a...
              </li>
              <li>
                <Link href='/' className='navbar__link--error'>Character</Link>
              </li>
              <li>
                <Link href='/' className='navbar__link--error'>World</Link>
              </li>
              <li>
                <Link href='/' className='navbar__link--error'>Game</Link>
              </li>
              <li>
                <Link href='/' className='navbar__link--error'>Community</Link>
              </li>
            </ul>
          </details>
        </li>

        <li><Link href='/'>Games</Link></li>

        {/* <li><a>Community</a></li> */}
        <li tabIndex={1}>
          <details>
            <summary>Community</summary>
            <ul className="p-2 bg-accent text-accent-content">
              <li className='px-4'>coming soon!</li>
            </ul>
          </details>
        </li>

      </ul>
    </div>
  )
}

export function NavbarEnd(props) {
  // const { item } = props;

  return (
    <div className="navbar-end">
      {/* <a className="btn">Button</a> */}
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <img src="/images/stock/photo-1534528741775-53994a69daeb.jpg" />
          </div>
        </label>

        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">

          <li>
            <Link href='/' className="justify-between">
              Profile
              <span className="badge">New</span>
            </Link>
          </li>

          <li><Link href='/user-settings'>Settings</Link></li>

          <li><Link href='/'>Logout</Link></li>
        </ul>

      </div>
    </div>

  )
}

function Login() {
  function onClick() {
    googleSignInPopUp()
  }

  return (
    <button className="btn hidden" id={ui.mainLayout.loginButton.id} onClick={onClick}>LogIn</button>
  )
}

function Logout() {
  const { push } = useRouter();

  function onClick() {
    push('/')
    userAuth.signOut()
  }

  return (
    <button className="btn hidden" id={ui.mainLayout.logoutButton.id} onClick={onClick}>LogOut</button>
  )
}