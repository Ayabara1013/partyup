export const ui = {
  home: {
    userName: {
      id: 'homeUserName',
      element: () => {
        return document.getElementById('homeUserName')
      }
    },
    userMenu: {
      id: 'homeUserMenu',
      element: () => {
        return document.getElementById('homeUserMenu')
      }
    },
    createGame: {
      id: 'homeCreateGame',
      element: () => {
        return document.getElementById('homeCreateGame')
      }
    },
    continueGame: {
      id: 'homeContinueGame',
      element: () => {
        return document.getElementById('homeContinueGame')
      }
    },
    gameList: {
      id: 'homeGameList',
      element: () => {
        return document.getElementById('homeGameList')
      }
    },
    publicGames: {
      id: 'homePublicGames',
      element: () => {
        return document.getElementById('homePublicGames')
      }
    },
  },
  createGame: {
    name: {
      id: 'createGameName',
      element: () => {
        return document.getElementById('createGameName')
      }
    },
    description: {
      id: 'createGameDescription',
      element: () => {
        return document.getElementById('createGameDescription')
      }
    },
    hasChapters: {
      id: 'createGameHasChapters',
      element: () => {
        return document.getElementById('createGameHasChapters')
      }
    },
    maxChapters: {
      id: 'createGameMaxChapters',
      element: () => {
        return document.getElementById('createGameMaxChapters')
      }
    },
    hasActs: {
      id: 'createGameHasActs',
      element: () => {
        return document.getElementById('createGameHasActs')
      }
    },
    maxActs: {
      id: 'createGameMaxActs',
      element: () => {
        return document.getElementById('createGameMaxActs')
      }
    },
    isPublic: {
      id: 'createGameIsPublic',
      element: () => {
        return document.getElementById('createGameIsPublic')
      }
    },
    maxPlayers: {
      id: 'createGamePlayerCount',
      element: () => {
        return document.getElementById('createGamePlayerCount')
      }
    },
  },
  editGame: {
    name: {
      id: 'editGameName',
      element: () => {
        return document.getElementById('editGameName')
      }
    },
    description: {
      id: 'editGameDescription',
      element: () => {
        return document.getElementById('editGameDescription')
      }
    },
    isPublic: {
      id: 'editGameIsPublic',
      element: () => {
        return document.getElementById('editGameIsPublic')
      }
    },
    maxPlayers: {
      id: 'editGamePlayerCount',
      element: () => {
        return document.getElementById('editGamePlayerCount')
      }
    },
    maxChapters: {
      id: 'editGameMaxChapters',
      element: () => {
        return document.getElementById('editGameMaxChapters')
      }
    },
    hasActs: {
      id: 'editGameHasActs',
      element: () => {
        return document.getElementById('editGameHasActs')
      }
    },
    hasChapters: {
      id: 'editGameHasChapters',
      element: () => {
        return document.getElementById('editGameHasChapters')
      }
    },
    maxActs: {
      id: 'editGameMaxActs',
      element: () => {
        return document.getElementById('editGameMaxActs')
      }
    },
    currentChapter: {
      id: 'editGameCurrentChapter',
      element: () => {
        return document.getElementById('editGameCurrentChapter')
      }
    },
    currentAct: {
      id: 'editGameCurrentAct',
      element: () => {
        return document.getElementById('editGameCurrentAct')
      }
    },
  },
  mainLayout: {
    alert: {
      id: 'mainNavAlert',
      element: () => {
        return document.getElementById('mainNavAlert')
      }
    },
    alertMessage: {
      id: 'mainNavAlertMessage',
      element: () => {
        return document.getElementById('mainNavAlertMessage')
      }
    },
    loginButton: {
      id: 'mainNavLoginButton',
      element: () => {
        return document.getElementById('mainNavLoginButton')
      }
    },
    logoutButton: {
      id: 'mainNavLogoutButton',
      element: () => {
        return document.getElementById('mainNavLogoutButton')
      }
    },
  },
  messaging: {
    canon: {
      id: 'canonChatEnd',
      element: () => {
        return document.getElementById('canonChatEnd')
      }
    },
    init: {
      id: 'initChatEnd',
      element: () => {
        return document.getElementById('initChatEnd')
      }
    },
    open: {
      id: 'openChatEnd',
      element: () => {
        return document.getElementById('openChatEnd')
      }
    },
    dm: {
      id: 'dmChatEnd',
      element: () => {
        return document.getElementById('dmChatEnd')
      }
    },
  }
}