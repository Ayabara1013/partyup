const messageLocalStorage = {
  game: {
    get(gameId) {
      const messages = localStorage.getItem(`${gameId}-messages`);
      if (messages) {
        return JSON.parse(messages);
      }
      return [];
    },
    getAccessTime(gameId) {
      const time = localStorage.getItem(`${gameId}-messagesAccessTime`);
      if (time) {
        return parseInt(time);
      }
      return 0;
    },
    set(gameId, messages) {
      localStorage.setItem(`${gameId}-messages`, JSON.stringify(messages));
      localStorage.setItem(`${gameId}-messagesAccessTime`, `${Date.now()}`);
    },
  }
}
const accountLocalStorage = {
  getCurrentGame: () => {
    return (localStorage) ? localStorage.getItem(`currentGame`): null;
  },
  setCurrentGame: (gameId) => {
    (localStorage) && localStorage.setItem(`currentGame`, gameId);
  },
  getEditGame: () => {
    return (localStorage) ? localStorage.getItem(`editGame`): null;
  },
  setEditGame: (gameId) => {
    (localStorage) && localStorage.setItem(`editGame`, gameId);
  },
}

export {
  accountLocalStorage,
  messageLocalStorage
}