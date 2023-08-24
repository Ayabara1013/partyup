import Link from 'next/link';

// font awesome imports
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faHome, faUser, faPaperPlane, faAnglesDown, faHouse } from '@fortawesome/free-solid-svg-icons';
library.add(faCoffee, faHome, faUser, faPaperPlane, faAnglesDown, faHouse);

const profileImage = "https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg";

export default function NavigationBar(props) {

  const NavLeft = () => {
    return (
      <div className="flex-0">
        <a className="btn btn-ghost normal-case text-xl">daisyUI</a>
      </div>
    )
  }

  const NavCenter = () => {
    return (
      <div className="flex-1 justify-center">
        <ul className="menu menu-horizontal px-1">

          <li><Link href='/'>home</Link></li>
          <li><Link href='/game'>game</Link></li>

          <li>
            <details>
              <summary>
                misc
              </summary>
              <ul className="p-2 bg-neutral z-50">
                <li><Link href='/something'>something</Link></li>
                <li><a>Link 2</a></li>
              </ul>
            </details>
          </li>

        </ul>
      </div>
    )
  }

  const NavRight = () => {
    return (
      <div className="flex-none gap-2">
        <div className="form-control">
          <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
        </div>

        <div className="dropdown dropdown-end">

          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              {profileImage ? <img src={profileImage} /> : <FontAwesomeIcon icon="fa-solid fa-user" />}
            </div>
          </label>

          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
            <li><a className="justify-between">Profile<span className="badge">New</span></a></li>
            <li><a>Settings</a></li>
            <li><a>Logout</a></li>
          </ul>

        </div>
      </div>
    )
  }

  return (
    <div className="navbar bg-base-100">
      <NavLeft />
      <NavCenter />
      <NavRight />
    </div>
  )
}