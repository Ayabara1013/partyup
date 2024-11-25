import { charactersCollection, gamesCollection } from '@/test/fake firestore/tavern-test-1/collections/firestoreObjects';




export default function findCharacterByUserId(userId, gameId=gamesCollection.game1.gid) {


  // console.clear();

  // const list = Object.values(charactersCollection).map((entry, key) => {
  //   console.log(`checking entry ${key}`)
  //   return entry;
  // })

  // console.log(list);

  // target = list.find(user => user.userId === targetUserId)

  // console.log(target.characterId, ':', target);

  const list = Object.values(charactersCollection).map((character) => {
    // if (character.name === 'Cassidy Flynn') console.log(`found him!`);
    return character;
  })

  const target = list.find(character => character.userId === userId)

  return target;
}


