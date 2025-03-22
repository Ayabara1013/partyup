const domainHref = "http://localhost:3000";
const dirHref = {
  discover: '/discover',
  error: '/error',
  home: '/home',
  playPrefix: '/play',
  community: {
    root: `/community`,
    create: `/community/create`
  },
  games: {
    root: '/games',
    create: '/games/create',
    join: function (gameId) {
      return `/games/invite/${gameId}`;
    },
    inviteLink: function (gameId, inviteCode) {
      return domainHref + `/games/invite/${gameId}${inviteCode && `/${inviteCode}`}`;
    },
    play: function (gameId) {
      return `/games/play/${gameId}`
    },
    gm: {
      edit: function (gameId) {
        return `/games/gm/edit/${gameId}`
      }
    }
  },
  user: {
    chooseDisplayName: `/user/choose-display-name`,
    signin: `/user/signin`,
    signup: `/user/signup`,
    settings: '/user/settings',
    subscription: '/user/subscription',
    update: '/user/update',
  }
}

export {dirHref, domainHref};