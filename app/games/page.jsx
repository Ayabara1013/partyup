import Link from 'next/link';
import Page from '../page';



export default function Games() {
  return (
    <div className={`games-page page-wrapper flex flex-col p-4`}>

      <div className='border p-4'>
        <div>your games</div>

        <div className='bg-neutral'>card 1</div>
      </div>

      <div>modify your games</div>

      <div>game info</div>

      <div>modify players / roles</div>

      <div>sort games</div>

      <div>create a new game</div>


      <div className='games-list p-1'>
        <div className='text-xl text-primary font-bold'>
          your games
        </div>

        <div className='flex flex-col gap-2'>
          <GameCard />
          <GameCard />
          <GameCard />
        </div>
      </div>

    </div>
  )
}

function GameCard() {
  return (
    <div className='games-list__card flex flex-col p-2 bg-neutral rounded'>
      <div className='bg-base-200 h-20'>picture</div>
      <div className='text-primary text-xl'>starborne mercenaries</div>
      <div>red angle real throw lunch myself parallel today sugar laid vowel break among serious continent war slope tomorrow differ solid wonderful across finally mainly</div>

      <div className='grid grid-flow-col gap-4 justify-stretch'>
        <button className='btn btn-primary'>play</button>
        <button className='btn btn-primary'>edit</button>
      </div>
    </div>
  )
}



// export default function Games() {
//   return (
//     <div className='games-page page-wrapper flex flex-col items-center'>
//       <div className='page-header text-3xl text-primary font-semibold'>Games</div>

//       <div className='tb1 flex flex-wrap justify-center p-6 gap-6 max-w-screen-lg '>
//         <PageOption title={'create a game'}>create a game</PageOption>
//         <PageOption title={'manage your games'}>manage your games</PageOption>
//         <PageOption title={'find a game'}>find a game</PageOption>
//         <PageOption title={'join a game'}>join a game</PageOption>
//       </div>
//     </div>
//   )
// }


// function PageOption({className, title, btnText, children, href, ...props}) {
//   return (
//     <div className="card hover:scale-105 transition-all w-96 bg-primary text-primary-content">
//       <div className="card-body">
//         <h2 className="card-title text-3xl capitalize">{title ? title : 'Card title!'}</h2>
//         {children && <p>{children}</p>}

//         <div className="card-actions justify-end">
//           <button className="btn btn-ghost">Buy Now</button>
//         </div>
//       </div>
//     </div>
//   )
// }