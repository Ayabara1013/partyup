import { ExampleHome } from './ExampleHome'
import { Home } from './HomeElements'



export function HomeWelcome({ className = '' }) {
  const sectionStyles = 'rounded-lg px-2 py-4 md:px-4';

  const images = {
    games: '/images/038-adventure-1.png',
    stories: '/images/008-spellbook-1.png',
    community: '/images/042-epidemiology.png',
    time: '/images/058-watching-tv.png',
  }

  return (
    <div className={`${className} home__welcome home-section--padding relative flex flex-col gap-4 min-h-44`}>
      {/* <ExampleHome /> */}

      <Home.Section className={`${sectionStyles} px-2`}>
        <Home.Header>
          Welcome to Tavern!
        </Home.Header>

        <div className='border'>
          tavern brings you together with you're gaming group, new or old, no matter <span className='text-primary font-bold'>where</span> or <span className='text-primary font-bold uppercase'>when</span> you are
        </div>

        <div className='home__welcome__cards flex flex-col md:flex-row gap-2'>
          <Home.Actions.Card
            className='bg-neutral'
            header={'games'}
            // img={images.games}
            // first='img'
          >
            {/* card */}
          </Home.Actions.Card>

          <Home.Actions.Card
            className='bg-neutral'
            header={'stories'}
            // img={images.stories}
            // first='img'
          >
            {/* card */}
          </Home.Actions.Card>

          <Home.Actions.Card
            className='bg-neutral'
            header={'community'}
            // img={images.community}
            // first='img'
          >
            {/* card */}
          </Home.Actions.Card>

          <Home.Actions.Card
            className='bg-neutral'
            header={'time'}
            // img={images.time}
            // first='img'
          >
            {/* card */}
          </Home.Actions.Card>
        </div>

      </Home.Section>
    </div>
  )
}