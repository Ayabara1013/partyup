import { pageExtensions } from '@/next.config';
import timeSince from '@/util/timeSince';
import { Timestamp } from 'firebase/firestore';

function getRandomDate() {
	const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
	const randomDate = new Date(twoWeeksAgo + Math.random() * 14 * 24 * 60 * 60 * 1000);
	console.log(randomDate);
	return randomDate;
}

getRandomDate();

class User {
	constructor(uid, username, irlname, games, characters, hoursPlayed, lastActive) {
		this.uid = uid;
		this.username = username;
		this.irlname = irlname || null;
		this.games = games || [];
		this.characters = characters || [];
		this.hoursPlayed = hoursPlayed || 0;
		this.lastActive = lastActive || null;
	}
}

/**
 * regarding name vs username; 
 * the user class uses the username attribute instead of the name attribute because name would be too ambiguous, 
 *
 * the property is specifcially referencing the user's platform-specific username similar to a game character.
 * 
 * their irl name can be stored in the irlname property (I am unsure if it would be better to name this irlname or irlName)
 */

class Player {
	constructor(uid, game, cid) {
		this.uid = uid;
		this.game = game;
		this.cid = cid;
	}
}

class Character {
	constructor(cid, uid, game, name, details) {
		this.cid = cid;
		this.uid = uid;
		this.game = game || false;
		this.name = name;
		this.details = details || {};
	}
}

class Game {
	constructor(gid, players, system, name, gm, totalSeats, minSeats) {
		this.gid = gid;
		this.players = players || [];
		this.system = system;
		this.name = name;
		this.gm = gm;
		this.totalSeats = totalSeats;
		this.minSeats = minSeats || 4;
	}
}

class System {

}

class Message {

}540910

const starborne = {
	id: 'gid-starborne-73-74-61-72',
	name: 'Starborne: Mercenaries',
	system: 'swade',
	description: 'musical smell chart model still fall primitive into leader how instant vote wave brief successful particular basic mice pond slip dish stick field branch',
	gm: 'uid-40ce7e3b-5839-5bb6-b637-e25f83fba2fa',
	players: {
		'uid-40ce7e3b-5839-5bb6-b637-e25f83fba2fa': {
			role: 'game master',
			playerId: 'uid-40ce7e3b-5839-5bb6-b637-e25f83fba2fa',
			messageId: 'mid-4946025c-53bf-5453-9a32-5841aa728d4a',
			// characterName: 'Cassidy Flynn',
			characterId: 'cid-49cbde2a-a651-5368-8b3d-1076902141c1',
		},
		'uid-11a0b5c7-c8ee-5d9e-9e46-f232d450cd5d': {
			role: 'player',
			playerId: 'uid-11a0b5c7-c8ee-5d9e-9e46-f232d450cd5d',
			messageId: 'mid-ed4ef705-fc5c-5b9a-93f8-fd3373b15d55',
			characterName: 'Cassidy Flynn',
			characterId: 'cid-310b89cf-e1c9-5c51-8d4e-2b72b4945c35',
		},
		'uid-7a666e49-1c34-5112-934e-3d9e508e4509': {
			role: 'player',
			playerId: 'uid-7a666e49-1c34-5112-934e-3d9e508e4509',
			messageId: 'mid-9b50c119-5bcc-5e25-94f5-d0d49d99f776',
			characterName: 'Ellis Sawyer',
			characterId: 'cid-e41b6c95-c9d2-5c86-928f-9483fa1eafe2',
		},
		'uid-13a52330-a677-579c-a141-f51673f44daf': {
			role: 'player',
			playerId: 'uid-13a52330-a677-579c-a141-f51673f44daf',
			messageId: 'mid-4cfcba7e-666a-58cb-8495-1baad686cbeb',
			characterName: 'Bill Hayden',
			characterId: 'cid-01cbade9-e9e6-546a-80a8-3b9051535668',
		},
		'uid-d692ac1b-6c33-50cd-b777-6d306869bfa9': {
			role: 'player',
			playerId: 'uid-d692ac1b-6c33-50cd-b777-6d306869bfa9',
			messageId: 'mid-3f669bcd-2ccb-5371-9cd6-6f1b9f03826a',
			characterName: 'Ollie the Bestest Corgo',
			characterId: 'cid-c7fe2f27-176b-5d54-81b7-d278637f0740',
		},
	},
	messageId: 'mid-b8dd12d0-9c27-56f6-bc65-d2876fa5d4c7',
	tags: [ 'scifi', 'fantasy', 'space' ],
}


const fallenCrown = {
	
}





const charactersCollection = {
	'cid-001': {
		name: 'Cassidy Flynn',
		userId: 'uid-40ce7e3b-5839-5bb6-b637-e25f83fba2fa',
		characterId: 'cid-001',
		gameId: 'gid-4a4404a0-d04c-5bde-8e5c-1cce76c10510',
	},
	'cid-002': {
		name: 'Kordak Felbryn',
		userId: 'uid-11a0b5c7-c8ee-5d9e-9e46-f232d450cd5d',
		characterId: 'cid-002',
		gameId: 'gid-4a4404a0-d04c-5bde-8e5c-1cce76c10510',
	},
	'cid-003': {
		name: 'Ellis Sawyer',
		userId: 'uid-7a666e49-1c34-5112-934e-3d9e508e4509',
		characterId: 'cid-003',
		gameId: 'gid-4a4404a0-d04c-5bde-8e5c-1cce76c10510',
	},
	'cid-004': {
		name: 'Bill Hayden',
		userId: 'uid-13a52330-a677-579c-a141-f51673f44daf',
		characterId: 'cid-004',
		gameId: 'gid-4a4404a0-d04c-5bde-8e5c-1cce76c10510',

	},
	'cid-005': {
		// name: 'Ollie the Bestest Corgo',
		name: 'Ozzie the Bestest Corgo',
		userId: 'uid-d692ac1b-6c33-50cd-b777-6d306869bfa9',
		characterId: 'cid-005',
		gameId: 'gid-4a4404a0-d04c-5bde-8e5c-1cce76c10510',
	},
}
const cc = charactersCollection;


// const getUserGames = (user) => {
// 	let games = Object.values(gamesCollection).map((game, index) => {
// 		if (game.includes(user)) return game;
// 	})

// 	return games;
// }

// const getUserGames = (user) => {
// 	let games = Object.values(gamesCollection).filter((game) => {
// 		return game.players.some((player) => player.uid === user.uid);
// 	})

// 	return games;
// }


const usersCollection = {
	user1: {
		uid: 'uid-40ce7e3b-5839-5bb6-b637-e25f83fba2fa',
		username: 'Tomlite',
		memberType: `Free`,
		memberSince: `10/14/23`,
		hoursPlayed: Math.ceil(Math.random() * 1000) + 1 || 0,
		lastActive: timeSince('random', 'conversational'),
		// characters: [cc.character1]
	},

	user2: {
		uid: 'uid-11a0b5c7-c8ee-5d9e-9e46-f232d450cd5d',
		username: 'IceyGeography',
		memberType: `Free`,
		memberSince: `10/14/23`,
		hoursPlayed: Math.ceil(Math.random() * 1000) + 1 || 0,
		lastActive: timeSince('random', 'conversational'),
		// characters: [cc.character2]
	},

	user3: {
		uid: 'uid-7a666e49-1c34-5112-934e-3d9e508e4509',
		username: 'WorldlyMule',
		memberType: `Free`,
		memberSince: `10/14/23`,
		hoursPlayed: Math.ceil(Math.random() * 1000) + 1 || 0,
		lastActive: timeSince('random', 'conversational'),
	},

	user4: {
		uid: 'uid-13a52330-a677-579c-a141-f51673f44daf',
		username: 'BrightSlump',
		memberType: `Free`,
		memberSince: `10/14/23`,
		hoursPlayed: Math.ceil(Math.random() * 1000) + 1 || 0,
		lastActive: timeSince('random', 'conversational'),
		// characters: [cc.character4]
	},

	user5: {
		uid: 'uid-d692ac1b-6c33-50cd-b777-6d306869bfa9',
		username: 'FatalCrook',
		memberType: `Free`,
		memberSince: `10/14/23`,
		hoursPlayed: Math.ceil(Math.random() * 1000) + 1 || 0,
		lastActive: timeSince('random', 'conversational'),
		// characters: [cc.character5]
	},

	user6: new User('uid-98765432-aaaa-bbbb-cccc-1234567890ab', 'ShadowWalker', [], []),	
	user7: new User('uid-12345678-abcd-efgh-ijkl-9876543210dc', 'MysticFox', [], []),
	user8: new User('uid-abcdef12-3456-7890-abcd-efghijklmnop', 'IronCladPaladin', [], []),
	user9: new User('uid-0a1b2c3d-4e5f-6789-abcd-ef1234567890', 'StormSinger', [], []),
	user10: new User('uid-10', 'CrimsonVoyager', [], []),

	user11: new User('uid-11', 'EchoHunter', [], []),
  user12: new User('uid-12', 'SilentSpecter', [], []),
  user13: new User('uid-13', 'NebulaForge', [], []),
  user14: new User('uid-14', 'IronTide', [], []),
  user15: new User('uid-15', 'ShadowCircuit', [], []),
}
const uc = usersCollection;


/**
 * game id
 * users array
 * game system
 * game name
 * game master
 */
const gamesCollection = {
  game1: new Game(
    'gid-4a4404a0-d04c-5bde-8e5c-1cce76c10510',
    [uc.user1, uc.user2, uc.user3, uc.user4, uc.user5],
    'starfinder 2e',
    'Starborne: Mercenaries',
    uc.user1,
    7
  ),
  game2: new Game(
    'gid-fd21f907-e0f4-5bbc-8bc6-898398cf0bc6',
    [uc.user1, uc.user2, uc.user3, uc.user4, uc.user5],
    'dungeons & dragons 5e',
    'Realm of the Silver Flame',
    uc.user1,
    6
  ),
  game3: new Game(
    'gid-8369cb0a-15ab-5a7a-a529-a9c4fdc7988b',
    [uc.user1, uc.user2, uc.user3, uc.user4, uc.user5],
    'cyberpunk red',
    'Neon City Chronicles',
    uc.user1,
    5
  ),
  game4: new Game(
    'gid-ff19187f-e5b6-584a-8345-2601bf47194d',
    [uc.user1, uc.user2, uc.user3],
    'pathfinder 2e',
    'Shadows Over Eldarion',
    uc.user2,
    8
  ),
  game5: new Game(
    'gid-d2fbf9fc-bfdc-5f36-94fe-3e10d5f9e5b8',
    [uc.user1, uc.user2, uc.user3, uc.user4, uc.user5, uc.user6, uc.user7],
    'call of cthulhu',
    'Whispers of the Forgotten',
    uc.user3,
    6
	),
	


  game6: new Game(
    'gid-6a8d9b27-f3ad-58cb-901b-91b5df874f29',
    [uc.user2, uc.user3, uc.user4, uc.user5],
    'vampire: the masquerade',
    'Bloodlines Requiem',
    uc.user2,
    5
  ),
  game7: new Game(
    'gid-2b3c4d5e-6f7a-8g9h-abcd-123456789abc',
    [uc.user3, uc.user4, uc.user5, uc.user6],
    'blades in the dark',
    'The Shadowed Streets',
    uc.user3,
    6
  ),
  game8: new Game(
    'gid-8h7g6f5e-4d3c-2b1a-abcd-987654321abc',
    [uc.user4, uc.user5, uc.user6, uc.user7],
    'mutants & masterminds',
    'Emerald Dawn',
    uc.user4,
    4
  ),
  game9: new Game(
    'gid-9i8j7k6l-5m4n-3o2p-abcd-654321098abc',
    [uc.user5, uc.user6, uc.user7, uc.user8],
    'fate core',
    'Eclipse Station',
    uc.user5,
    5
  ),
  game10: new Game(
    'gid-1a2b3c4d-5e6f-7g8h-abcd-876543210abc',
    [uc.user6, uc.user7, uc.user8, uc.user9],
    'powered by the apocalypse',
    'Broken Skies',
    uc.user6,
    6
	),
	


	game11: new Game(
    'gid-11a22b33c44d55e66f77',
    [uc.user6, uc.user7, uc.user8, uc.user9],
    'starfinder',
    'The Celestial Shards',
    uc.user6,
    5
  ),
  game12: new Game(
    'gid-22b33c44d55e66f77a88',
    [uc.user7, uc.user8, uc.user9, uc.user10, uc.user11],
    'dungeons & dragons 5e',
    'Echoes of Eternity',
    uc.user7,
    6
  ),
  game13: new Game(
    'gid-33c44d55e66f77a88b99',
    [uc.user8, uc.user9, uc.user10, uc.user11, uc.user12],
    'warhammer fantasy',
    'The Iron Siege',
    uc.user8,
    7
  ),
  game14: new Game(
    'gid-44d55e66f77a88b99c00',
    [uc.user9, uc.user10, uc.user11, uc.user12, uc.user13],
    'savage worlds',
    'Through the Maelstrom',
    uc.user9,
    5
  ),
  game15: new Game(
    'gid-55e66f77a88b99c00d11',
    [uc.user10, uc.user11, uc.user12, uc.user13, uc.user14, uc.user15],
    'numenera',
    'Fragments of the Unknown',
    uc.user10,
    6
  ),
};
const gc = gamesCollection;


const messagesCollection = {

}



// db script shiz

const getUserGames = (user) => {
	let games = Object.values(gamesCollection).filter((game) => {
		return game.players.some((player) => player.uid === user.uid)
	})

	return games;
}

const assignGamesToUsers = () => {
	Object.values(usersCollection).forEach((user) => {
		user.games = getUserGames(user);
	})
}

const getUserCharacters = (user) => {
	let characters = Object.values(charactersCollection).filter((character) => {
		return character.userId === user.uid;
	})

	return characters;
}

const assignCharactersToUsers = () => {
	Object.values(usersCollection).forEach((user) => {
		user.characters = getUserCharacters(user);
	})
}

assignGamesToUsers();
assignCharactersToUsers();


console.log(uc.user1, 'color: yellow');




export {
	starborne,
	gamesCollection,
	usersCollection,
	charactersCollection,
	User, Player, Character, Game, System, Message,

}