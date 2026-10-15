type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export type ChatChannel = `canon` | `turn` | `open`;

export type CachedMessage = {
    id: string;
    channel: ChatChannel[];
    createdAt: string;
    updatedAt: string;
    [key: string]: any;
};

export type GameSettings = {
    loaded: boolean;
    rollingStick: any;
    talkingStick: string;
    openMute?: any;
};

const CHAT_LOG_VERSION = 2;

const keys = {
    notifications: (uid: string) => `${uid}-notifications`,
    notificationTime: (uid: string) => `${uid}-notificationTime`,
    otherUpdates: (uid: string) => `${uid}-otherUpdates`,
    chatLog: (gid: string) => `${gid}-chatLog-v${CHAT_LOG_VERSION}`,
    settings: (gid: string) => `${gid}-settings`,
};

const hasStorage = () => typeof window !== `undefined` && !!window.localStorage;


function read<T>(key: string, fallback: T): T {
    if (!hasStorage()) return fallback;
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
        localStorage.removeItem(key); // corrupt entry, drop it
        return fallback;
    }
}

function write(key: string, value: Json | unknown) {
    if (!hasStorage() || value === undefined) return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.warn(`localStorage write failed for ${key}`, e); // quota exceeded / private mode
    }
}

function remove(key: string) {
    if (hasStorage()) localStorage.removeItem(key);
}

function getSetTimestamp(key: string): number {
    const now = Date.now();
    const previous = read<number | null>(key, null);
    write(key, now);
    return previous ?? now;
}

function normalizeMessage(m: any): CachedMessage {
    return {...m, channel: Array.isArray(m.channel) ? m.channel : [m.channel]};
}

const lsAccount = {
    notificationTime: (uid: string) => getSetTimestamp(keys.notificationTime(uid)),
    getLastOtherUpdateTime: (uid: string) => getSetTimestamp(keys.otherUpdates(uid)),
    notifications: {
        get: (uid: string) => read<any[]>(keys.notifications(uid), []),
        set: (uid: string, notifications: any[]) => {
            if (uid && notifications) write(keys.notifications(uid), notifications);
        },
    },
};

const lsInGame = {
    get: {
        chatLog: (gid: string): CachedMessage[] =>
            read<any[]>(keys.chatLog(gid), []).map(normalizeMessage),
        settings: (gid: string): GameSettings =>
            read<GameSettings>(keys.settings(gid), {loaded: false, rollingStick: ``, talkingStick: ``, openMute: null}),
    },
    set: {
        chatLog: (gid: string, messages: CachedMessage[]) => {
            if (gid && messages) write(keys.chatLog(gid), messages);
        },
        settings: (gid: string, settings: GameSettings) => {
            if (gid && settings) write(keys.settings(gid), settings);
        },
    },
    clear: {
        chatLog: (gid: string) => remove(keys.chatLog(gid)),
        allChatLogs: () => {
            if (!hasStorage()) return;
            Object.keys(localStorage)
                .filter((k) => /-chatLog(-v\d+)?$/.test(k))
                .forEach(remove);
        },
        legacy: () => {
            // remove chat logs from older cache versions
            if (!hasStorage()) return;
            Object.keys(localStorage)
                .filter((k) => /-chatLog(-v\d+)?$/.test(k) && !k.endsWith(`-v${CHAT_LOG_VERSION}`))
                .forEach(remove);
        },
    },
};


export {
    lsAccount,
    lsInGame
}