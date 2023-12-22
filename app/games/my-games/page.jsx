import Link from 'next/link';
import '@styles/games/my-games/my-games-card.scss';
import { MyGamesCard } from './(components)/MyGamesCard';

export default function MyGames() {
  return (
    <div className='games-root-page page-wrapper flex flex-col p-8 gap-8 items-center' >
      <div className='text-5xl font-bold text-primary page-header'>Your Games</div>

      <div className='flex flex-col gap-4'>
        <TopOptions />

        <MyGamesCard className='' />
        <MyGamesCard className='' />
        <MyGamesCard className='' />
        <MyGamesCard className='' />
      </div>

      <div>
        <Link href={'/discover'} className='btn btn-primary'>or do you want to look for another game?</Link>
      </div>
    </div>
  )
}

function TopOptions() {
  return (
    <div className="flex flex-col gap-2 items-center">
      {/* <div className='text-xl font-semi-bold'>your games</div> */}

      <div className="flex gap-2">
        <Link href={'/create/game'} className='btn btn-primary'>create a game</Link>
        <Link href={'/games/my-games'} className='btn btn-primary'>view my games</Link>
        {/* <input type="text" placeholder='search your games' className='input input-primary max-w-xs' /> */}
      </div>
    </div>
  )
}

