
import '@styles/games/my-games/my-games-card.scss';

export function MyGamesCard({ className, ...props }) {
  return (
    <div className={`${className} my-games-card flex flex-col p-2 gap-2 rounded-xl items-center`}>
      <div className="flex justify-between text-xl font-semibold text-primary m-auto w-2/3 tb2 whitespace-nowrap">
        <div>this game</div>
        <div>by this person</div>
        <div>this system</div>
        <div>this many of / this may players</div>
      </div>

      <div className='my-games-card__description'>property vertical green battle highway herself hang satisfied package may doll town love break lungs round headed sun give what command came beauty fewer</div>

      <button className=' btn my-games-card__button btn-secondary'>button</button>
    </div>
  )
}