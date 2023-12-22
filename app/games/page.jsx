import Link from 'next/link';
import Page from '../page';


export default function Games() {
  return (
    <div className='games-page page-wrapper flex flex-col items-center'>
      <div className='page-header text-3xl text-primary font-semibold'>Games</div>

      <div className='tb1 flex flex-wrap justify-center p-6 gap-6 max-w-screen-lg '>
        <PageOption title={'create a game'}>create a game</PageOption>
        <PageOption title={'manage your games'}>manage your games</PageOption>
        <PageOption title={'find a game'}>find a game</PageOption>
        <PageOption title={'join a game'}>join a game</PageOption>
      </div>
    </div>
  )
}


function PageOption({className, title, btnText, children, href, ...props}) {
  return (
    <div className="card hover:scale-105 transition-all w-96 bg-primary text-primary-content">
      <div className="card-body">
        <h2 className="card-title text-3xl capitalize">{title ? title : 'Card title!'}</h2>
        {children && <p>{children}</p>}

        <div className="card-actions justify-end">
          <button className="btn btn-ghost">Buy Now</button>
        </div>
      </div>
    </div>
  )
}