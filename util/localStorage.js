const messageLocalStorage = {
  getInit(gameId) {
    const messages = localStorage.getItem(`${ gameId }-init`);
    if (messages) {
      return JSON.parse(messages);
    }
    return [];
  },
  getInitAccessTime(gameId) {
    const time = localStorage.getItem(`${ gameId }-initAccessTime`);
    if (time) {
      return parseInt(time);
    }
    return 0;
  },
  setInit(gameId, messages) {
    localStorage.setItem(`${ gameId }-init`, JSON.stringify(messages));
    localStorage.setItem(`${ gameId }-initAccessTime`, `${ Date.now() }`);
  },

  getCasual(gameId) {
    const messages = localStorage.getItem(`${ gameId }-casual`);
    if (messages) {
      return JSON.parse(messages);
    }
    return [];
  },
  getCasualAccessTime(gameId) {
    const time = localStorage.getItem(`${ gameId }-casualAccessTime`);
    if (time) {
      return parseInt(time);
    }
    return 0;
  },
  setCasual(gameId, messages) {
    localStorage.setItem(`${ gameId }-casual`, JSON.stringify(messages));
    localStorage.setItem(`${ gameId }-casualAccessTime`, `${ Date.now() }`);
  }
}
export {
  messageLocalStorage
}