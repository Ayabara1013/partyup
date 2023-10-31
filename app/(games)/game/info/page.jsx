import { content } from '@/app/discover/page';

import './game-info.scss';

export default function GameInfo(props) {
  // const { item } = props;

  const playersCurrent = content.players.current;
  const playersMax = content.players.max;
  const playersRemaining = playersMax - playersCurrent;

  return (
    <div className={`game-info`}>
      <img src={content.imageUrl} alt="" />

      <div className='page-title text-5xl font-bold text-center text-primary m-8'>
        {content.name}
      </div>

      <div className="details-wrapper flex gap-8">
        <div className='game-details border border-success'>
          <div className='game-description border border-success'>
            {content.description.split('\n').map((paragraph, i) => {
              return <p key={i}>{paragraph}</p>
            })}
          </div>
        </div>

        <div className='players-card border border-sucess whitespace-nowrap'>
          <div>players</div>
          <div>{playersCurrent}/{playersMax} ({playersRemaining} spots remaining)</div>
          {
            content.players.list.map((player, i) => {
              return <PlayerListing key={i} player={player} />
            })
          }
        </div>
      </div>
    </div>
  )
}