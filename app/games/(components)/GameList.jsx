
import Link from "next/link";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";

import JoinRequestList from "@components/gm/joinRequestList";
import {useModal} from "@app/(contexts)/popupModal";
import {dirHref} from "@/javascript/assets/directoryHref";
import {fbGmManager} from "@/javascript/firebase/managers/fbGmManager";
import {useAccountManager} from "@app/(contexts)/accountManager";

export default function MyGamesList({gameList, type = 'player'}) {
  const title = type === 'player' ? 'Player Games' : 'GM Games';
  return (
    <>
      <div className='m-auto text-3xl font-semibold'>{title}</div>
      <div className='games-page__section --games-list'>
        <ul className='games-page__games-list'>
          {gameList.map((game, index) => {
            return <GameListItem key={index}{...{game, type}}/>
          })}
        </ul>
      </div>
    </>
  )
}

function GameListItem({game, type}) {
  let playerCount = game.players.length
    , totalSeats = game.maxPlayers
    , minSeats = 2;
  let pcs =
    playerCount === totalSeats ? 'text-success'
      : playerCount < minSeats ? 'text-warning'
        : 'text-neutral-content';

  return (
    <div className='games-page__games-list__item'>
      <div className={`flex flex-wrap justify-start items-end gap-x-2`}>
        <div className='text-2xl font-semibold text-primary'>{game.name}</div>
        <div className={`text-opacity-50`}>(System: {game.system})</div>
        <GameListItemOptions {...{game, type}}/>
      </div>

      <div className="flex gap-2">
        <div className={`${pcs} text-xl font-bold whitespace-nowrap`}>{playerCount} / {totalSeats}</div>
        <PlayersList className={`flex-1 my-auto`} {...{game, playerCount, totalSeats}}/>
      </div>
    </div>
  )
}

function PlayersList({className, game, playerCount, totalSeats}) {
  let remainingSeats = totalSeats - playerCount;
  const {userDetails} = useAccountManager();

  async function copyInvite() {
    toast(`Copied invite link`)
    await navigator.clipboard.writeText(dirHref.games.inviteLink(game.id, game.inviteCode));
  }

  function FilledSeats() {
    let seats = [];
    game.players.forEach((player, index) => {
      seats.push(
        <li key={index} className={`__players-list__item ${index >= totalSeats ? '--error' : '--filled'}`}>
          <p className={`pointer-events-none`}>{player.uName}{userDetails.id === player.id && ` (you)`}</p>
        </li>
      )
    })
    return seats;
  }

  const RemainingSeats = () => {
    let seats = [];

    for (let i = playerCount; i < remainingSeats + playerCount; i++) {
      seats.push(
        <li key={i} onClick={copyInvite}
            className={`__players-list__item ${i >= totalSeats ? '--error' : '--empty'} full-element-btn`}><p>Invite</p>
        </li>
      )
    }
    return seats;
  }
  return (
    <div className={`__players-list ${className}`}>
      <div className='__players-list__list flex flex-row flex-wrap gap-2'>
        <FilledSeats/>
        <RemainingSeats/>
      </div>
    </div>
  )
}

function GameListItemOptions({game, type}) {
  const {push} = useRouter();
  const {setGames} = useAccountManager()
  const {showModal, setTitle, setModalChildren} = useModal();
  const startFunc = async () => {
    if (await fbGmManager.general.startGame(game.id)) {
      setGames()
      setTimeout(() => {
        toast.success(`${game.name} has been started. Redirecting...`)
        push(dirHref.games.play(game.id));
      }, 1500)
    } else {
      toast.error(`${game.name} failed to start!`)
    }
  }

  function showModalOnClick() {
    setTitle(`Game join requests`);
    setModalChildren(<JoinRequestList game={game}/>)
    showModal();
  }


  function PlayButton() {
    return <Link href={dirHref.games.play(game.id)}
                 className='btn btn-xs btn-accent ml-auto font-semibold'>Play</Link>
  }

  function GMStartButton() {
    return <button onClick={startFunc}
                   className='btn btn-xs btn-accent ml-auto font-semibold'>Start</button>;
  }

  function GMEditButton() {
    return <Link href={dirHref.games.gm.edit(game.id)}
                 className='btn btn-xs btn-accent ml-auto font-semibold'>edit</Link>
  }

  function GMJoinRequestButton() {
    return (
      <button onClick={showModalOnClick} className='btn btn-xs btn-accent ml-auto font-semibold'>Join Requests
        <div className="badge badge-sm badge-neutral">{game.joinRequests.length}</div>
      </button>)
  }

  return (
    <div className={`flex gap-2 ml-auto`}>
      {(game.status !== `started` && type === `gm`) && <GMJoinRequestButton/>}
      {type === `gm` && <GMEditButton/>}
      {game.status === `started` && <PlayButton/>}
      {(game.status !== `started` && type === `gm`) && <GMStartButton/>}
    </div>
  )
}