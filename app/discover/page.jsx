import { DiscoverCard } from '@/components/discover/DiscoverCard';
import FilterItem from '@/components/discover/FilterItem';
import FilterTabs from '@/components/discover/FilterTabs';
import { gamesCollection, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import { getRandomInt } from '@/test/getRandomInt';





const users = usersCollection;

export const content = {
  gameId: 'gid-d6b56cf8-5f08-5ef1-b9b3-892024e24bfd',
  name: 'Starborne: Mercenaries',
  description: `Waking up on a strange planet, you find yourself in a strange situation. You have no memory where you are, or how you got here. You are not alone, however. There are others here, and they seem to be in the same situation as you. You must work together to survive, and to find a way home. Or so you though.\nAs you quickly discover, you have been abducted along with a SIXTH of the world's population to take part in the most popular gameshow in the galaxy; the Starlight Bloodbowl.`,
  gm: users.user1, // this will actually be a proper ref to the gm on the db
  tags: [],
  system: 'SWADE',
  players: {
    current: 5,
    max: 6,
    list: gamesCollection.game1.players,
  },
  nextGame: '10/13/1992',
  numMessages: getRandomInt(),
  imageUrl: 'https://images.ctfassets.net/swt2dsco9mfe/1dQoOoGmRy9NMlAU2aEULd/e8a5f6134a5afba59b3a0cac3cf4f31d/tiamat-email.jpg?q=70',
};

// const badge = {
//   inactive: 'badge badge-outline',
//   active: 'badge',
// }

const FilterGroup = ({ label, options, active }) => {
  return (
    <div className='search__filters__filter tb2 grow m-auto tb3'>
      <div className='search__filters__filter__label'>{label}</div>
      <ul className='search__filters__filter__content'>
        {options.map((option, i) => {
          return (
            <li key={i} className={`search__filters__filter__content__option 
            ${active ? 'badge badge-primary' : 'badge badge-outline badge-primary'}`}>
              {option}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const filters = {
  type: ['one-shot', 'campaign', 'west-marches'],
  system: ['swade', 'dnd5e', 'pf2e'],
  players: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'],
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
}

export default function Discover(props) {

  return (
    <div className={`discover-page h-full`}>
      <div className='search border-b w-full p-4'>
        <div className='search__bar mb-4 px-4'>
          <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full" />
        </div>

        <FilterTabs >
          {/* <FilterItem label={'Game Type'} isActive={true} />
          <FilterItem label={'System'} isActive={false} />
          <FilterItem label={'Player Count'} isActive={true} />
          <FilterItem label={'Tags'} isActive={false} /> */}
        </FilterTabs>

        {/* <FilterGroup label={'type'} options={['option1', 'option2', 'option3']} active={true} />
        <FilterGroup label={'type'} options={['option1', 'option2', 'option3']} active={false} /> */}
      </div>

      <DiscoverCard content={content} />
      <DiscoverCard content={content} />

    </div>
  )
}

