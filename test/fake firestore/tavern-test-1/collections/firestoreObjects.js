class User {
	constructor(uid, name, games, characters) {
		this.uid = uid;
		this.name = name;
		this.games = games || [];
		this.characters = characters || [];
	}
}

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
	constructor(gid, players, system, name, gm) {
		this.gid = gid;
		this.players = players || [];
		this.system = system;
		this.name = name;
		this.gm = gm;
	}
}

class System {

}

class Message {

}

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

const usersCollection = {
	'uid-40ce7e3b-5839-5bb6-b637-e25f83fba2fa': {
		role: 'game master',
	},
	'uid-11a0b5c7-c8ee-5d9e-9e46-f232d450cd5d': {
		characterName: 'Cassidy Flynn',
	},
	'uid-7a666e49-1c34-5112-934e-3d9e508e4509': {
		characterName: 'Ellis Sawyer',
	},
	'uid-13a52330-a677-579c-a141-f51673f44daf': {
		characterName: 'Bill Hayden',
	},
	'uid-d692ac1b-6c33-50cd-b777-6d306869bfa9': {
		characterName: 'Ozzie the Bestest Corgo',
	},
}

const gamesCollection = {

	1: new Game(
		1, 
		[
			usersCollection[`uid-40ce7e3b-5839-5bb6-b637-e25f83fba2fa`],
			usersCollection[`uid-11a0b5c7-c8ee-5d9e-9e46-f232d450cd5d`],
			usersCollection[`uid-7a666e49-1c34-5112-934e-3d9e508e4509`],
			usersCollection[`uid-13a52330-a677-579c-a141-f51673f44daf`],
			usersCollection[`uid-d692ac1b-6c33-50cd-b777-6d306869bfa9`],
		], 
		'swade',
		'Starborne: Mercenaries',
		usersCollection['uid-40ce7e3b-5839-5bb6-b637-e25f83fba2fa']),
}

const messagesCollection = {

}

const charactersCollection = {
	'Cassidy Flynn': {

	}
}


export {
	starborne,
	gamesCollection,
	usersCollection,
}