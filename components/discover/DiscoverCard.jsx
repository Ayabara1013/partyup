import '@/app/discover/discover.scss'
import { starborne } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import { Timestamp } from 'firebase/firestore';
import Link from 'next/link';
// import Superclamp from 'superclamp';
const coolImages = require("cool-images");


export function DiscoverCard(props) {
	const { content } = props;
	let startedDate = new Date('2021-06-30');

	// Superclamp.register(document.querySelectorAll('.clamp-me'));
	// window.addEventListener('resize', Superclamp.reclampAll);
	/** it would be really cool to get this working, but atm, I have no idea how! */

	function timeSince(date) {
		var seconds = Math.floor((new Date() - date) / 1000);

		var years = Math.floor(seconds / 31536000);
		seconds %= 31536000;

		var months = Math.floor(seconds / 2592000);
		seconds %= 2592000;

		var days = Math.floor(seconds / 86400);

		return `${years}y, ${months}m, ${days}d`;
	}

	const DiscoverLeft = () => {
		return (
			<div className='discover-card-left flex border-accent'>
				<div className='aspect-square'>
					<img src={coolImages.one(200, 200)} alt="" className=' rounded-full h-full' />
				</div>

				<div className=' border-success whitespace-nowrap'>
					<div className='text-center text-primary text-lg font-bold'>Game Master</div>
					<ul className='indent-2'>
						<li>Tomlite</li>
						<li>Free</li>
						<li>Member since: 10/14/23</li>
						<li>Hours Played: 0</li>
					</ul>
				</div>
			</div>
		)
	}

	// const DiscoverMiddle = () => {
	//   return (
	//     <>
	//       <div className='discover-card__middle__game-name border'>
	//         {content.name}
	//       </div>

	//       <div className='discover-card__middle__description flex-1 border line-clamp-4'>
	//         {content.description.split('\n').map((paragraph, i) => {
	//           return <p key={i} className='border border-success'>{paragraph}</p>
	//         })}
	//       </div>

	//       <div className='discover-card__middle__call-to-action flex m-auto'>
	//         <Link href='/'>
	//           <button className='btn btn-secondary'>read more</button>
	//         </Link>
	//       </div>
	//     </>
	//   )
	// }

	const DiscoverMiddle = ({content}) => {
		return (
			<div className='discover-card-middle flex flex-col justify-between p-2 border-accent overflow-clip rounded-xl shadow-xl'>

				{/* <img src="https://images.ctfassets.net/swt2dsco9mfe/1dQoOoGmRy9NMlAU2aEULd/e8a5f6134a5afba59b3a0cac3cf4f31d/tiamat-email.jpg?q=70" alt="" /> */}
				
				<div className=' text-center text-3xl text-primary font-bold'>
					Game Name
				</div>

				<div className=' line-clamp-4 indent-2'>
					{content.description.split('\n').map((paragraph, i) => {
						return <p key={i} className='mb-2 leading-5 border-success'>{paragraph}</p>
					})}
				</div>

				<div className=' flex justify-center'>
					<Link href='/'>
						<button className='btn btn-secondary'>read more</button>
					</Link>
				</div>
			</div>
		)
	}

	const DiscoverRight = ({timeSince, startedDate}) => {

		const LineItem = (props) => {
			const { label = 'label', value = 'value' } = props;
		
			return (
				<div className='whitespace-nowrap'>
					<span className='font-bold text-primary'>{label + ':\u00A0'}</span>
					<span>{value}</span>
				</div>
			)
		}
		
		return (
			<div className='discover-card-right border-accent'>
				<LineItem label='playing' value='SWADE' />
				<LineItem label='current players' value='5 (1 open slot)' />
				<LineItem
					label='ongoing since'
					value={`${startedDate.toLocaleDateString()} ( ${timeSince(startedDate)} )`} />
				<LineItem label='last active' value='today' />
				<LineItem label='average frequency' value='< 2 hours' />
			</div>
		)
	}

	// return (
	//   <div className={`discover-card flex flex-row m-4 p-4 gap-4 min-w-[45%] bg-neutral`}>

	//     <div className={'discover-card__left flex gap-2 border border-accent'}>
	//       <img src={coolImages.one(200, 200)} alt="" className='rounded-[100%] h-48' />
	//       <div className='discover-card__dm'>
	//         <div>{content.gm}</div>
	//         <ul>
	//           <li>Tomlite</li>
	//           <li>Free</li>
	//           <li>Member since: 10/14/23</li>
	//           <li>Hours Played: 0</li>
	//         </ul>
	//       </div>
	//     </div>

	//     <div className='flex-1 border border-accent'>
	//       <div className='flex-1 line-clamp-4'>{content.description.split('\n').map((paragraph, i) => <p key={i} className='border border-success'>{paragraph}</p>)}</div>
	//     </div>

	//     {/* <DiscoverMiddle />   */}

	//     <div className={'discover-card__right border border-accent'}>
	//       {/* <div className='flex flex-wrap gap-2 w-full'>
	//         <div className='badge badge-primary'>primary</div>
	//         <div className='badge badge-secondary'>secondary</div>
	//         <div className='badge badge-accent'>accent</div>
	//         <div className='badge badge-info'>info</div>
	//         <div className='badge badge-success'>success</div>
	//         <div className='badge badge-warning'>warning</div>
	//         <div className='badge badge-error'>error</div>
	//       </div> */}

	//       <div className='border flex flex-wrap'>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//         <div className='badge badge-primary'>badge</div>
	//       </div>

	//       <div>
	//         <div>
	//           <span className='font-bold text-primary'>playing: </span>
	//           SWADE
	//         </div>

	//         <div>
	//           <span className="font-bold text-primary">Current Players: </span>
	//           5, (1 open slot)
	//         </div>

	//         <div>
	//           <span className="font-bold text-primary">ongoing since: </span>
	//           {startedDate.toLocaleDateString()} ( {timeSince(startedDate)} )
	//         </div>

	//         <div>
	//           <span className="font-bold text-primary">last active: </span>
	//           today
	//         </div>

	//         <div>
	//           <span className='text-primary font-bold'>average frequency: </span>
	//           {` < 2 hours`}
	//         </div>
	//       </div>
	//     </div>
	//   </div>
	// )

	return (
		<div className='discover-card flex bg-neutral m-4 p-4 gap-4 h-[16rem]'>
			<DiscoverLeft />
			<DiscoverMiddle content={content}/>
			<DiscoverRight timeSince={timeSince} startedDate={startedDate} />
		</div>
	)
}

// {startedDate.toLocaleDateString()} ( {timeSince(startedDate)}