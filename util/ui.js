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
    isPublic: {
      id: 'createGameIsPublic',
      element: () => {
        return document.getElementById('createGameIsPublic')
      }
    },
    playerCount: {
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
    playerCount: {
      id: 'editGamePlayerCount',
      element: () => {
        return document.getElementById('editGamePlayerCount')
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
    casual: {
      id: 'casualChatEnd',
      element: () => {
        return document.getElementById('casualChatEnd')
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