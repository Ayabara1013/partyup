import { DiscoverCard } from '@app/discover/(components)/DiscoverCard';
import FilterItem from '@app/discover/(components)/FilterItem';
import FilterTabs from '@app/discover/(components)/FilterTabs';
import { gamesCollection, starborne, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import { getRandomInt } from '@/test/getRandomInt';
import { Blocks } from '@/components/templates/Blocks';
import '@styles/blocks.scss';





const users = usersCollection;

export const content = {
  gameId: 'gid-d6b56cf8-5f08-5ef1-b9b3-892024e24bfd',
  name: 'Starborne: Mercenaries',
  // description: `Waking up on a strange planet, you find yourself in a strange situation. You have no memory where you are, or how you got here. You are not alone, however. There are others here, and they seem to be in the same situation as you. You must work together to survive, and to find a way home. Or so you though.\nAs you quickly discover, you have been abducted along with a SIXTH of the world's population to take part in the most popular gameshow in the galaxy; the Starlight Bloodbowl.`,
  description: (
    <>
      <p className='text-justify'>Waking up on a strange planet, you find yourself in a strange situation. You have no memory where you are, or how you got here. You are not alone, however. There are others here, and they seem to be in the same situation as you. You must work together to survive, and to find a way home.</p>
      <p className='text-center'>Or so you though. You have been abducted along with a SIXTH of the world's population to take part in the most popular gameshow in the galaxy;</p>
      <p className='text-center text-xl'><b>The Starlight Bloodbowl.</b></p>
    </>
  ),
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



const filters = {
  type: ['one-shot', 'campaign', 'west-marches'],
  system: ['swade', 'dnd5e', 'pf2e'],
  players: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+'],
  tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
}

export default function Discover(props) {
  // return (
  //   <div className='page-wrapper'>
      // <Blocks.Section>
      //   <input type="text" placeholder="search" className="input input-bordered input-primary w-full" />

      //   <ol className='b2 flex flex-wrap gap-6 list-decimal list-inside'>
      //     <Blocks.SearchFilter>player count</Blocks.SearchFilter>
      //     <Blocks.SearchFilter>system</Blocks.SearchFilter>
      //     <Blocks.SearchFilter className='btn-accent'>genre</Blocks.SearchFilter>
      //     <Blocks.SearchFilter>open</Blocks.SearchFilter>
      //     <Blocks.SearchFilter>locked</Blocks.SearchFilter>
      //     <Blocks.SearchFilter>accessibility</Blocks.SearchFilter>
      //     <Blocks.SearchFilter>tags</Blocks.SearchFilter>
      //     <Blocks.SearchFilter>things</Blocks.SearchFilter>
      //   </ol>

      //   <ol>
      //     <ol className='b2 flex flex-wrap gap-6 list-decimal list-inside'>
      //       <Blocks.SearchFilter className=''>5th Edition D&D</Blocks.SearchFilter>
      //       <Blocks.SearchFilter className='btn-accent'>Fate Core</Blocks.SearchFilter>
      //       <Blocks.SearchFilter className=''>Pathfinder 1st Edition</Blocks.SearchFilter>
      //       <Blocks.SearchFilter className='btn-accent'>Savage Worlds (SWADE)</Blocks.SearchFilter>
      //     </ol>
      //   </ol>
      // </Blocks.Section>

      // <Blocks.Section>
      //   <div className='tb1 flex gap-2 h-[12rem]'>
      //     <div className='tb2'>game picture</div>
      //     <div className='tb2 flex-auto'>game details</div>
      //     <div className='tb2'>game description</div>
      //   </div>
      //   <div className='tb1 flex gap-2 h-[12rem]'>
      //     <div className='tb2'>game picture</div>
      //     <div className='tb2 flex-auto'>game details</div>
      //     <div className='tb2'>game description</div>
      //   </div>
      // </Blocks.Section>
  //   </div>
  // )

  return (
    <div className={`discover-page page-wrapper`}>
      <Blocks.Section>
        <input type="text" placeholder="search" className="input input-bordered input-primary mb-2 w-full " />

        <ol className='b2 flex flex-wrap gap-6 list-decimal list-inside'>
          <Blocks.SearchFilter>player count</Blocks.SearchFilter>
          <Blocks.SearchFilter>system</Blocks.SearchFilter>
          <Blocks.SearchFilter className='btn-accent'>genre</Blocks.SearchFilter>
          <Blocks.SearchFilter>open</Blocks.SearchFilter>
          <Blocks.SearchFilter>locked</Blocks.SearchFilter>
          <Blocks.SearchFilter>accessibility</Blocks.SearchFilter>
          <Blocks.SearchFilter>tags</Blocks.SearchFilter>
          <Blocks.SearchFilter>things</Blocks.SearchFilter>
        </ol>

        <ol>
          <ol className='b2 flex flex-wrap gap-6 list-decimal list-inside'>
            <Blocks.SearchFilter className=''>5th Edition D&D</Blocks.SearchFilter>
            <Blocks.SearchFilter className='btn-accent'>Fate Core</Blocks.SearchFilter>
            <Blocks.SearchFilter className=''>Pathfinder 1st Edition</Blocks.SearchFilter>
            <Blocks.SearchFilter className='btn-accent'>Savage Worlds (SWADE)</Blocks.SearchFilter>
          </ol>
        </ol>
      </Blocks.Section>

      <Blocks.Section className='gap-2'>
        <div className='tb1 flex gap-2 h-[12rem]'>
          <div className='tb2'>game picture</div>
          <div className='tb2 flex-auto'>game details</div>
          <div className='tb2'>game description</div>
        </div>
        <div className='tb1 flex gap-2 h-[12rem]'>
          <div className='tb2'>game picture</div>
          <div className='tb2 flex-auto'>game details</div>
          <div className='tb2'>game description</div>
        </div>
      </Blocks.Section>

      <div className="text-center text-6xl text-warning font-extrabold">or this</div>
      
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

