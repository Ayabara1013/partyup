const messageLocalStorage = {
  game:{
    get(gameId) {
      const messages = localStorage.getItem(`${ gameId }-messages`);
      if (messages) {
        return JSON.parse(messages);
      }
      return [];
    },
    getAccessTime(gameId) {
      const time = localStorage.getItem(`${ gameId }-messagesAccessTime`);
      if (time) {
        return parseInt(time);
      }
      return 0;
    },
    set(gameId, messages) {
      localStorage.setItem(`${ gameId }-messages`, JSON.stringify(messages));
      localStorage.setItem(`${ gameId }-messagesAccessTime`, `${ Date.now() }`);
    },
  }
}
export {
  messageLocalStorage
}