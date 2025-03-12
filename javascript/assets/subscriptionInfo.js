export const subscriptionInfo = { // fake context object
  tier1: {
    title: 'Free',
    price: 0,
    tier: 1,
    gmGames: 0,
    features: [
      <>can participate in up to 2 games<sup>1</sup></>,
      <>1 demo game world<sup>2</sup></>,
    ],
    smallScript: [
      <>upon joining a game, you will be locked out of joining new games for 1 week. This is tracked per allotted
        game.</>
    ]
  },

  tier2: {
    title: 'Lite',
    price: 3,
    tier: 2,
    gmGames: 1,
    features: [
      <>unlimited games as a player</>,
      <>1 personal game world(s)<sup>1</sup></>,
    ],
    smallScript: [
      <>additional worlds can be enabled for an additional per-world cost</>
    ],
  },

  tier3: {
    title: 'Game Master',
    price: 10,
    tier: 3,
    gmGames: 5,
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
    <>additional details & specifics for the features of each plan can be found <a href="#my_modal_8"
                                                                                   className='text-accent'>here!</a></>,
}