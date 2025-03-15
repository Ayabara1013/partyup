import '@styles/discover/discover.scss'
import timeSince from '@/javascript/util/timeSince';
import {Timestamp} from 'firebase/firestore';
import {gameSystems} from "@/javascript/assets/gameSystems";
import Link from "next/link";
import {dirHref} from "@/javascript/assets/directoryHref";

const coolImages = require("cool-images");

const focusBoxClass = 'm-auto p-2  border-success whitespace-nowrap bg-neutral-focus  rounded-xl shadow-xl';

export function DiscoverCard({game}) {

  const ListItem = (props) => {
    const {label = 'label', value = 'value'} = props;

    return (
      <li className='whitespace-nowrap'>
        <span className='font-semibold text-secondary'>{label + ': '}</span>
        <span>{value}</span>
      </li>
    )
  }

  const DiscoverLeft = () => {
    // const listItemClass = 'font-semibold text-secondary';

    return (
      <div className='discover-card-left flex border-accent gap-4'>
        {/* <div className='inner-wrapper flex'> */}
        <div className='aspect-square'>
          <img src={coolImages.one(200, 200)} alt="" className=' rounded-full h-full shadow-xl'/>
        </div>

        <div className={`gm-details ${focusBoxClass}`}>
          <div className='text-center text-primary text-lg font-bold'>Game Master</div>
          <ul>
            <ListItem label='Username' value={game.uName}/>
          </ul>
        </div>
        {/* </div> */}
      </div>
    )
  }

  const DiscoverMiddle = () => {
    return (
      <div
        className='discover-card-middle flex flex-col justify-between p-2 border-accent overflow-clip rounded-xl shadow-xl grow'>
        <div className=' text-center text-3xl text-primary font-bold text-shadow-md'>
          {game.name}
        </div>

        <div className=' line-clamp-4 indent-4 text-shadow-md'>
          {game.description}
        </div>
        <div className='flex justify-center'>
          <Link href={dirHref.games.join(game.id, game.inviteCode)} className='btn btn-secondary btn-shadow-md'>Go To</Link>
        </div>
      </div>
    )
  }

  const DiscoverRight = () => {
    const pCur = 2;	// current players
    const pMax = game.maxPlayers;			// max players
    const pRem = pMax - pCur;										// remaining players
    Timestamp.now().toDate()
    return (
      <div className={`discover-card-right ${focusBoxClass}`}>
        <ul>
          <ListItem label='System' value={gameSystems.valueToTitle[game.system]}/>
          <ListItem label='current players' value={`${pCur}/${pMax} (${pRem} seat remaining)`}/>
          <ListItem label='ongoing since'
                    value={`${game.createdAt.toDate().toLocaleDateString()} (${timeSince(game.createdAt.toDate())})`}/>
          <ListItem label='last active' value='Maybe Stat'/>
          <ListItem label='average frequency' value='Maybe Stat'/>
          <ListItem label='total messages' value='Maybe Stat'/>
        </ul>
      </div>
    )
  }

  return (
    <div className='discover-card flex bg-neutral m-4 p-4 gap-4 h-[16rem]'>
      <DiscoverLeft/>
      <DiscoverMiddle/>
      <DiscoverRight/>
    </div>
  )
}