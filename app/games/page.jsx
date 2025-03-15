'use client'

import '@styles/games/games.scss'
import {useApplication} from '@app/(contexts)/application';
import {fbGmManagement} from "@/javascript/firebase/fbGmManagement";
import Link from 'next/link';
import toast from "react-hot-toast";
import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {dirHref} from "@/javascript/assets/directoryHref";
import {useModal} from "@app/(contexts)/popupModal";
import JoinRequestList from "@components/gm/joinRequestList";

export default function MyGames({className}) {
  const {push} = useRouter();
  const {userDetails, gmGames, playerGames, setGames, checkUser} = useApplication();

  const startFunc = async (game) => {
    if (await fbGmManagement.general.startGame(game.id)) {
      setGames()
      setTimeout(() => {
        toast.success(`${game.name} has been started. Redirecting...`)
        push(dirHref.games.play(game.id));
      }, 1500)
    } else {
      toast.error(`${game.name} failed to start!`)
    }
  }

  return (
    (gmGames &&
      <div className={`${className} games-page page-wrapper flex flex-col gap-8`}>
        {gmGames && <MyGamesList gameList={gmGames.gameList} title={`GM Games`} type={'gm'} {...{startFunc}}/>}
        {playerGames && <MyGamesList gameList={playerGames.gameList} title={`Player Games`}/>}

        <div className='games-page__section --find-more-games'>
          <Link className={`btn button-breakpoints m-auto px-6 w-1/2 ${gmGames.canCreate() ? '' : 'btn-disabled'}`}
                href={dirHref.games.create}>
            create a game</Link>
          <Link className='btn btn-primary button-breakpoints m-auto w-1/2 md:px-6 txt-3xl'
                href={dirHref.discover}>
            find more games</Link>
          <Link className='btn btn-primary button-breakpoints m-auto w-1/2 md:px-6 txt-3xl'
                href={dirHref.games.root}>
            return</Link>
        </div>
      </div>
    )
  )
}

function MyGamesList({gameList, type = 'player', title, startFunc}) {
  const {showModal, setTitle, setModalChildren} = useModal();
  return (
    <>
      <div className='m-auto text-3xl font-semibold'>{title}</div>
      <div className='games-page__section --games-list'>
        <ul className='games-page__games-list'>
          {
            gameList.map((game, index) => {
              let playerCount = game.members.length;
              let totalSeats = game.maxPlayers;
              let minSeats = 2;
              let pcs = playerCount === totalSeats ? 'text-success' : 'text-error';
              if (playerCount < totalSeats) pcs = playerCount < minSeats ? 'text-warning' : 'text-neutral-content'

              function showModalOnClick() {
                setTitle(`Game join requests`);
                setModalChildren(<JoinRequestList game={game}/>)
                showModal();
              }

              return (
                <div className='games-page__games-list__item' key={index}>
                  <div className={`__item-header flex flex-wrap justify-start items-end gap-x-2`}>
                    <div className='__item-header__name text-2xl font-semibold text-primary'>{game.name}</div>
                    <div className={`__item-header__system text-opacity-50`}>(System: {game.system})</div>
                    {(type === 'gm') && (
                      <>
                        {(game.status !== 'started') &&
                          <button onClick={showModalOnClick}
                                  className='btn btn-xs btn-accent ml-auto font-semibold'>Join Requests
                            <div className="badge badge-sm badge-neutral">+{game.requests.length}</div>
                          </button>}
                        {game.status === 'started'
                          ? <Link className='btn btn-xs btn-accent ml-auto font-semibold'
                                  href={dirHref.games.play(game.id)}>Play</Link>
                          : <button className='btn btn-xs btn-accent ml-auto font-semibold' onClick={() => {
                            startFunc(game)
                          }}>Start</button>}
                      </>
                    )
                    }
                  </div>

                  <div className="flex gap-2">
                    <div className={`${pcs} text-xl font-bold whitespace-nowrap`}>{playerCount} / {totalSeats}</div>
                    <PlayersList className={`flex-1 my-auto`} {...{game, playerCount, totalSeats}}/>
                    {(type === 'gm')
                      && <Link href={dirHref.games.gm.edit(game.id)}
                               className='btn btn-xs btn-square btn-accent m-auto font-semibold'>edit</Link>}
                  </div>
                </div>
              )
            })
          }
        </ul>
      </div>
    </>
  )
}

function PlayersList({className, game, playerCount, totalSeats}) {
  let remainingSeats = totalSeats - playerCount;

  async function copyInvite() {
    toast(`Copied invite link`)
    console.log(game)
    await navigator.clipboard.writeText(dirHref.games.inviteLink(game.id, game.inviteCode));
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
        {game.members.map((member, index) => {
          return (
            <li key={index} className={`__players-list__item ${index >= totalSeats ? '--error' : '--filled'}`}>
              {member.username}
            </li>
          )
        })}
        <RemainingSeats/>
      </div>
    </div>
  )
}