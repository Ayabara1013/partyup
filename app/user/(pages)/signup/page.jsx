
import '@styles/settings/signup.scss';




const fc = { // fake context object
  isUser: true,

  option1: {
    title: 'free',
    price: 0,
    features: [
      <>can participate in up to 2 games as a player<sup>1</sup></>,
      <>1 demo game world<sup>2</sup></>,
      // <></>
    ],
    smallScript: [
      <>upon joining a game, you will be locked out of joining new games for 1 week. This is tracked per alloted game.</>
    ]
  },

  option2: {
    title: 'Lite',
    price: 3,
    features: [
      <>unlimited games as a player</>,
      <>1 personal game world(s)<sup>1</sup></>,
    ],
    smallScript: [
      <>additional worlds can be enabled for an additional per-world cost</>
    ],
  },

  option3: {
    title: 'Game Master',
    price: 10,
    features: [
      <>unlimited games as a player</>,
      <>up to 5 active<sup>1</sup> game worlds</>,
      <>access to additional gm tools<sup>2</sup> & experimental features<sup>3</sup></>
    ],
    smallScript: [
      <>game worlds on the Game Master plan may be deactivated, and will be stored </>
    ],
  },

  standardSmallScript:
    <>additional details & specifics for the features of each plan can be found <a href="#my_modal_8" className='text-accent'>here!</a></>,
  
  
}

{/*  */}

export default function Signup({ className }) {
  return (
    <div className={`${className} signup-page tb1 flex p-8 justify-center h-full`}>

      <div className="modal" role="dialog" id="my_modal_8">
        <div className="modal-box flex flex-col gap-4">
          <h3 className="text-lg font-bold">Additional Details:</h3>
          {/* <p className="py-4">This modal works with anchor links</p> */}
          <p><sup>1.1</sup> upon joining a game, you will be locked out of joining another game for (1) week. This is tracked on a per-game basis. you may still join a second game if you have not used your second alloted game or your second alloted game is not currently locked</p>

          <p><sup>1.2</sup> the provided world on the free tier is only a demo world to allow you to experience the paid features of Tavern, and is not useable with other players. Some features are also locked until you upgrade to a membership tier with access to running your own world. you will have the choice of activating your demo world as a playable world, or keeping it as a demo space.</p>

          <p><sup>2.1</sup>lite tier users are allowed 1 active game world by default. Additional worlds are available on an à la carte basis.</p>
          
          <p><sup>3.1</sup> GM tier users are allowed 5 active game worlds by default. Additional worlds are available on an à la carte basis</p>

          <p><sup>3.2, 3.3</sup> in addition to the pro-tier gm tools, Gm tier uses have the option to access experimental and early preview features before the rest of the userbase</p>

          <div className="modal-action">
            <a href="#" className="btn">close</a>
          </div>
        </div>
      </div>

      <div className='signup-wrapper tb2 flex-col-4 m-auto p-4 rounded min-w-[66%] min-h-[66%]'>
        <div className='tb3'>you are an existing user!</div>

        <div className='subscription-options tb3 flex flex-1 gap-4'>
          
          <SubscriptionOption
            title={fc.option1.title} price={fc.option1.price}
            features={fc.option1.features} smallScript={fc.option2.smallScript && fc.option1.smallScript} />
          <SubscriptionOption
            title={fc.option2.title} price={fc.option2.price}
            features={fc.option2.features} smallScript={fc.option2.smallScript && fc.option2.smallScript} />
          <SubscriptionOption
            title={fc.option3.title} price={fc.option3.price}
            features={fc.option3.features} smallScript={fc.option3.smallScript && fc.option3.smallScript}
            className={'--pro-option'} />

        </div>

        <div>{fc.standardSmallScript}</div>
      </div>

    </div>
  )
}

export function SubscriptionOption({ className, title = '<ERROR>', price = '<ERROR>', features, smallScript }) {
  // const list = [
  //   'hello world',
  //   'you suck',
  //   <>a thid point<sup>1</sup></>,
  // ]


  return (
    <div className={`${className} --option flex flex-col flex-1 p-4 justify-center bg-neutral rounded`}>
      <div className="option-wrapper tb1">
        <div className='--title tb2'>{title}</div>
        <div className='--price flex items-start tb2'>
          <div className='__currency'>$</div>
          <div className='__value'>{price}</div>
        </div>

        <div className='flex flex-col p-4 gap-2 tb2'>
          <div className='--subtitle'>features</div>
          <ul className='list-disc'>
            {features.map((element, index) => (
              <li key={index}>{element}</li>
            ))}
          </ul>
        </div>

        {/* <div>
          <ul className='text-xs'>
            {smallScript.map((element, index) => (
              <li key={index}><sup>{index} </sup>{element}</li>
            ))}
          </ul>
        </div> */}
      </div>

    </div>
  )
}


function ExistingUser({ className }) {
  return (
    <div className={`${className} tb1`}>
      <div>you already seem to be a user! do you want to change to a different tier?</div>
    </div>
  )
}


export function CancelAttempt({ className }) {
  return (
    <div className={`${className}`}>
      <div>you have selected to cancel your membership to Tavern, are you sure?</div>
      <div>
        <button>yes</button>
        <button>no</button>
      </div>
    </div>
  )
}



      {/* <div className='signup-wrapper tb2 flex-col-4 w-[60%]'>
        {fc.isUser && <ExistingUser />}
        
        <div className='subscription-options flex gap-4'>
          <div className='--option flex-1'>
            <div className='__header text-3xl font-bold'>free</div>
          </div>

          <div className='--option '>
            basic
          </div>

          <div className='--option '>
            basic
          </div>
        </div>
      </div> */}