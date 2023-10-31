import { DiscoverCard } from '@/components/discover/DiscoverCard';
import { gamesCollection, usersCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';
import { getRandomInt } from '@/test/getRandomInt';

const users = usersCollection;

export default function Discover(props) {

  return (
    <div className={`discover-page h-full`}>
      <DiscoverCard content={content} />
      <DiscoverCard content={content} />
    </div>
  )
}

export const content = {
  gameId: 
  name: 'Starborne: Mercenaries',
  description: `Waking up on a strange planet, you find yourself in a strange situation. You have no memory where you are, or how you got here. You are not alone, however. There are others here, and they seem to be in the same situation as you. You must work together to survive, and to find a way home. Or so you though.\nAs you quickly discover, you have been abducted along with a SIXTH of the world's population to take part in the most popular gameshow in the galaxy; the Starlight Bloodbowl.`,
  gm: usersCollection['uid-40ce7e3b-5839-5bb6-b637-e25f83fba2fa'], // this will actually be a proper ref to the gm on the db
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