import '@styles/discover/discover.scss'
import { starborne } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import timeSince from '@/util/timeSince';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';
// import Superclamp from 'superclamp';
const coolImages = require("cool-images");

// removed m-auto so it fits wide
const focusBoxClass = 'p-2 border-success whitespace-nowrap bg-neutral-focus  rounded-xl shadow-xl';

export function JoinGameCardWide(props) {
	const { content } = props;
	let startedDate = new Date('2021-06-30');

	// Superclamp.register(document.querySelectorAll('.clamp-me'));
	// window.addEventListener('resize', Superclamp.reclampAll);
	/** it would be really cool to get this working, but atm, I have no idea how! */
	
	const ListItem = (props) => {
		const { label = 'label', value = 'value' } = props;
	
		return (
			<li className='whitespace-nowrap'>
				<span className='font-semibold text-secondary'>{label + ': '}</span>
				<span>{value}</span>
			</li>
		)
	}

	const JoinLeft = () => {
		// const listItemClass = 'font-semibold text-secondary';	

		return (
			<div className='discover-card-left flex flex-col gap-4 min-w-[224px]'>
				{/* <div className='inner-wrapper flex'> */}
					<div className='aspect-square border'>
						<img src={coolImages.one(200, 200)} alt="" className=' rounded-full h-full shadow-xl' />
					</div>

					<div className={`gm-details ${focusBoxClass}`}>
						<div className='text-center text-primary text-lg font-bold'>Game Master</div>
						<ul>
							<ListItem label='Username' value={content.gm.username} />
							<ListItem label='User tier' value={content.gm.memberType} />
							<ListItem label='Member since' value={content.gm.memberSince} />
							<ListItem label='Hours played' value={content.gm.hoursPlayed} />
						</ul>
					</div>
				{/* </div> */}
			</div>
		)
	}

	const JoinMiddle = ({content}) => {
		return (
			<div className='discover-card-middle flex flex-col justify-between p-2 border-accent overflow-clip rounded-xl shadow-xl'>
				
				<div className=' text-center text-3xl text-primary font-bold text-shadow-md'>
					{content.name}
				</div>

				<div className=' line-clamp-4 indent-4 text-shadow-md'>
					{/* {content.description.split('\n').map((paragraph, i) => {
						return <p key={i} className='mb-2 leading-5 font-semibold text-shadow-default border-success'>{paragraph}</p>
					})} */}
					{content.description}
				</div>

				<div className=' flex justify-center'>
					<Link href='/game/info' className=''>
						<button className='btn btn-secondary btn-shadow-md'>read more</button>
					</Link>
				</div>
			</div>
		)
	}

	const JoinRight = (props) => {
		const { timeSince, startedDate, content } = props;

		const pcur = content.players.current;	// current players
		const pmax = content.players.max;			// max players
		const prem = pmax - pcur;										// remaining players
		
		return (
			<div className={`discover-card-right ${focusBoxClass} mb-auto`}>
				<ul>
					<ListItem label='playing' value='SWADE' />
					<ListItem
						label='current players'
						value={`${pcur}/${pmax} (${prem} seat remaining)`}
					/>
					<ListItem
						label='ongoing since'
						value={`${startedDate.toLocaleDateString()} ( ${timeSince(startedDate)} )`}
					/>
					<ListItem label='last active' value='today' />
					<ListItem label='average frequency' value='< 2 hours' />
					<ListItem
						label='total messages'
						value={content.numMessages.toLocaleString()}
					/>
				</ul>

				{/* shrink this upwards! */}
			</div>
		)
	}

	const JoinTop = (props) => {
		return (
			<div>

			</div>
		)
	}

	return (
		<div className='join-card flex bg-neutral m-4 p-4 gap-4 min-h-[16rem]'>
			{/* <div className='join-card__side-panel border'>
				<div className='aspect-square'>
					<img src={coolImages.one(200, 200)} alt="" className=' rounded-full h-full shadow-xl' />
				</div>
			</div> */}
			<JoinLeft />

			<div className='join-card__middle'>
				<div className='join-card__top border m-auto  text-3xl text-accent font-bold text-shadow-md'>
					do you want to join '{content.name}'?
				</div>
				<div className='join-card__middle flex-col-4 gap-4'>
					<JoinMiddle content={content}/>
				</div>
				<div className='join-card__bottom flex tb3 p-4'>
					game details will go here
				</div>
			</div>

			<JoinRight content={content} timeSince={timeSince} startedDate={startedDate} />

		</div>
	)
}