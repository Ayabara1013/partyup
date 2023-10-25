'use client'

import { useRouter } from "next/navigation";

import Dir from "@/components/Dir";

import { googleSignInPopUp, userAuth } from "@/firebase/base";

import { ui } from "@/util/ui";

export default function NavBar(props) {
  return (
    <div className={`${props.className} header-nav navbar bg-base-100`}>
      <div className="navbar-start">
        <Dir.home>
          <button className="btn btn-ghost normal-case text-xl">PartyUp!</button>
        </Dir.home>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {/*<li></li>*/}
          {/*<li tabIndex={0}>*/}
          {/*    <details>*/}
          {/*        <summary>Parent</summary>*/}
          {/*        <ul className="p-2">*/}
          {/*            <li><a>Submenu 1</a></li>*/}
          {/*            <li><a>Submenu 2</a></li>*/}
          {/*        </ul>*/}
          {/*    </details>*/}
          {/*</li>*/}
          {/*<li><Dir.game/></li>*/}
        </ul>
      </div>
      <div className="navbar-end">
        <Login/>
        <Logout/>
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