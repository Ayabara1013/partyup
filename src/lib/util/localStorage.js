const lsAccount = {
  notificationTime: (uid) => {
    return getSetTimestamp(`${uid}-notifications`)
  },
  getLastOtherUpdateTime: (uid) => {
    return getSetTimestamp(`${uid}-otherUpdates`)
  },
  notifications: {
    get: function (uid) {
      const messages = localStorage.getItem(`${uid}-notifications`);
      if (messages  !== null)
        return JSON.parse(messages);
      return [];
    },
    set: function (uid, notifications) {
      if (uid && notifications) {
        localStorage.setItem(`${uid}-notifications`, JSON.stringify(notifications));
      }
    }

  }
}

const lsInGame = {
  get: {
    chatLog: function (gid) {
      const messages = localStorage.getItem(`${gid}-chatLog`);
      if (messages !== null)
        return JSON.parse(messages);
      return [];
    },
    settings: function (gid) {
      const settings = localStorage.getItem(`${gid}-settings`);
      if (settings  !== null)
        return JSON.parse(settings);
      return {
        loaded: false,
        rollingStick: {},
        talkingStick: ''
      };
    }
  },
  set: {
    chatLog: function (gid, messages) {
      if (messages  && gid)
        localStorage.setItem(`${gid}-chatLog`, JSON.stringify(messages));
    },
    settings: function (gid, settings) {
      if (settings && gid)
        localStorage.setItem(`${gid}-settings`, JSON.stringify(settings));
    }
  }
}

function getSetTimestamp(key) {
  let result = JSON.parse(localStorage.getItem(key));
  localStorage.setItem(key, JSON.stringify(Date.now()));
  return (result) ? result : Date.now();
}

export {
  lsAccount,
  lsInGame
}