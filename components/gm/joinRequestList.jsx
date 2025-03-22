import {fbGmManager} from "@/javascript/firebase/managers/fbGmManager";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";

export default function JoinRequestList({game}) {
  const [reqButtons, setReqButtons] = useState([]);
  useEffect(() => {
    let index = 0;
    let buttons = [];
    for (let reqUser of game.joinRequests) {
      async function acceptOnClick() {
        await fbGmManager.general.acceptJoinRequest(game.id, reqUser).then(result => {
          if (result) {
            toast.success(`Accepted ${reqUser.uName} request to join ${game.name}`);
          } else {
            toast.error(`Something went wrong.`);
          }
        })
        let newButtons = [...reqButtons]
        newButtons.splice(index, 1);
        setReqButtons(newButtons);
      }

      buttons.push(
        <button key={index} onClick={acceptOnClick}
                className={`btn btn-primary button-breakpoints md:px-6 txt-3xl`}>{reqUser.uName}</button>
      )
      if (buttons.length === 0) {
      }
      setReqButtons(buttons)
      index++;
    }


  }, []);
  return (
    <div className='__players-list__list flex flex-row flex-wrap gap-2 mt-5'>
      {reqButtons}
    </div>
  )
}