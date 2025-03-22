import {Timestamp} from "firebase/firestore";

const lsAccount = {
  getLastOtherUpdateTime: (uid) => {
    return getSetTimestamp(`otherUpdates${uid}`)
  },
}

const lsGameMessages = {
  getChatUpdaterPrevAccessTime(gid) {
    return getSetTimestamp(`${gid}chatAccessTimes`)
  },
  getChatLog(gid) {
    const messages = localStorage.getItem(`${gid}chatLog`);
    if (messages) return JSON.parse(messages);
    return [];
  },
  setChatLog(gid, messages) {
    if (messages && gid) {
      localStorage.setItem(`${gid}chatLog`, JSON.stringify(messages));
      localStorage.setItem(`${gid}chatLogAccessTime`, JSON.stringify(Timestamp.now()));
    }
  },
  getChatLogPrevAccessTime(gid) {
    return getSetTimestamp(`${gid}chatLogAccessTime`)
  }
}

function getSetTimestamp(key) {
  let result = JSON.parse(localStorage.getItem(key));
  localStorage.setItem(key, JSON.stringify(Timestamp.now()));
  if (!!result?.seconds && !!result?.nanoseconds) {
    return result;
  }
  return Timestamp.now();
}

export {
  lsAccount,
  lsGameMessages
}