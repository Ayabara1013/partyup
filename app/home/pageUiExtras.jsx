import CYACard from "@app/home/(components)/CYACard";
import alltxt from "@/javascript/assets/all_text";
import coolImages from "cool-images";


function CYACarousel(props) {
  const btnClass = 'btn btn-circle btn-ghost hover:btn-secondary text-primary-content text-2xl font-bold'
  const btnContainerClass = "absolute flex left-1 right-1 top-[65%] -translate-y-1/2 transform justify-between"

  return (
    <div className='p-8'>
      <div className="carousel w-full gap-4">
        <div id="slide1" className="carousel-item relative w-full">
          <CYACard header={alltxt.home.cya_card_1.header} img="/images/008-spellbook-1.png">
            {alltxt.home.cya_card_1.sub}
          </CYACard>
          <div className={btnContainerClass}>
            <a href="#slide4" className={btnClass}>❮</a>
            <a href="#slide2" className={btnClass}>❯</a>
          </div>
        </div>

        <div id="slide2" className="carousel-item relative w-full">
          <CYACard header={alltxt.home.cya_card_2.header} img="/images/038-adventure-1.png">
            {alltxt.home.cya_card_2.sub}
          </CYACard>
          <div className={btnContainerClass}>
            <a href="#slide1" className={btnClass}>❮</a>
            <a href="#slide3" className={btnClass}>❯</a>
          </div>
        </div>

        <div id="slide3" className="carousel-item relative w-full">
          <CYACard header={alltxt.home.cya_card_3.header} img="/images/042-epidemiology.png">
            {alltxt.home.cya_card_3.sub}
          </CYACard>
          <div className={btnContainerClass}>
            <a href="#slide2" className={btnClass}>❮</a>
            <a href="#slide4" className={btnClass}>❯</a>
          </div>
        </div>

        <div id="slide4" className="carousel-item relative w-full">
          <CYACard header={alltxt.home.cya_card_4.header} img="/images/058-watching-tv.png">
            {alltxt.home.cya_card_4.sub}
          </CYACard>
          <div className={btnContainerClass}>
            <a href="#slide3" className={btnClass}>❮</a>
            <a href="#slide1" className={btnClass}>❯</a>
          </div>
        </div>

      </div>
    </div>
  )
}

function GameCard() {

  const randomImg = coolImages.one(800, 800);

  return (
    <div className='game-card flex flex-col col-span-1 justify-center h-full bg-neutral rounded-md overflow-clip'>
      <div className='flex flex-col text-center bg-primary h-12 text-lg'>
        <div className='m-auto'>game name</div>
      </div>

      <div className='game-card__content flex flex-col p-4 gap-2'>
        <div>hello world this is a game</div>

        <img className='text-center aspect-square w-full bg-red-400 rounded shadow-lg shadow-base-200'
             src={randomImg}/>

        <p className='text-sm'>height fact recall student method community private hat electricity touch single
          shelf name exactly depend select art official win border buried pot differ glad</p>
      </div>
    </div>
  )
}