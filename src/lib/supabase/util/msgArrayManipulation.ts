import {getMillisec} from "@/lib/supabase/util/dateConversion";
import type {CachedMessage} from "@/lib/util/localStorage";

type TimestampLike = {
    seconds: number;
};

type MessageLike = {
    createdAt: TimestampLike;
    updatedAt: TimestampLike;
    [key: string]: any;
};

// The chat list held by useGameMessages: every message oldest first, plus the same messages indexed by id.
// `cursor` is the newest updatedAt among *fetched* rows (the server's exact string); realtime rows never move it.
export type MessageState = {
    list: CachedMessage[];
    byId: Map<string, CachedMessage>;
    cursor: string | null;
};

// Created time in ms, parsed once per message object
const createdMsCache = new WeakMap<CachedMessage, number>();

export function createdMs(message: CachedMessage): number {
    let ms = createdMsCache.get(message);
    if (ms === undefined) {
        ms = new Date(message.createdAt).getTime();
        createdMsCache.set(message, ms);
    }
    return ms;
}

// Oldest first; the id breaks ties so messages with the same timestamp keep a fixed order
function compareCreated(a: CachedMessage, b: CachedMessage): number {
    return createdMs(a) - createdMs(b) || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

// Index of `message` in a list sorted by compareCreated (binary search, with a scan as the fallback)
function indexOfSorted(list: CachedMessage[], message: CachedMessage): number {
    let low = 0;
    let high = list.length;
    while (low < high) {
        const mid = (low + high) >> 1;
        if (compareCreated(list[mid], message) < 0) low = mid + 1;
        else high = mid;
    }
    return list[low] === message ? low : list.indexOf(message);
}

// A timestamp in microseconds. Date keeps only milliseconds, but updated_at has microseconds, and realtime and REST
// may format the same value differently, so versions are compared as numbers, not strings. NaN if unreadable.
export function timestampUs(ts: string): number {
    const iso = String(ts).replace(` `, `T`).replace(/([+-]\d\d)$/, `$1:00`);
    const fraction = /\.(\d+)/.exec(iso)?.[1] ?? ``;
    const ms = Date.parse(fraction ? iso.replace(`.${fraction}`, `.${fraction.padEnd(3, `0`).slice(0, 3)}`) : iso);
    return ms * 1000 + Number(fraction.padEnd(6, `0`).slice(3, 6));
}

// Updated time in µs, parsed once per message object
const updatedUsCache = new WeakMap<CachedMessage, number>();

function updatedUs(message: CachedMessage): number {
    let us = updatedUsCache.get(message);
    if (us === undefined) {
        us = timestampUs(message.updatedAt);
        updatedUsCache.set(message, us);
    }
    return us;
}

// A row replaces our copy only if it is a later version
// (not for the same version again, or an older one, e.g. a fetch that finishes after a newer realtime event)
function isNewerVersion(row: CachedMessage, current: CachedMessage): boolean {
    const currentUs = updatedUs(current);
    return Number.isNaN(currentUs) || updatedUs(row) > currentUs;
}

const msgArrayManipulation = {
    sortByCreated(array: any[] = []) {
        array.sort((a, b) => {
            return getMillisec.createdAt(a) - getMillisec.createdAt(b);
        });
    },

    sortByUpdated(array: any[]) {
        array.sort((a, b) => {
            return getMillisec.updatedAt(a) - getMillisec.updatedAt(b);
        });
    },

    sortByKey<T extends Record<string, any>>(array: T[], key: keyof T) {
        array.sort((a, b) => {
            const x = a[key];
            const y = b[key];

            return x < y ? -1 : x > y ? 1 : 0;
        });
    },

    combineReplaceOnKey<T extends Record<string, any>>(
        array: T[],
        arrayToAdd: T[],
        key: keyof T
    ) {
        for (const newMsg of arrayToAdd) {
            const index = array.findIndex((msg) => msg[key] === newMsg[key]);

            if (index === -1) {
                array.push(newMsg);
            } else {
                array[index] = newMsg;
            }
        }
    },

    // Merges rows into the list by id. A message that didn't change keeps its object (so memoized rows skip it),
    // and the same state comes back when nothing changed (so React skips the update). Appending is the common
    // case; the list is only re-sorted when a row arrives out of order.
    mergeMessages(state: MessageState, rows: CachedMessage[]): MessageState {
        let byId: Map<string, CachedMessage> | null = null;
        let list: CachedMessage[] | null = null;
        const added: CachedMessage[] = [];

        for (const row of rows) {
            if (!row?.id) continue; // realtime DELETE events carry no row
            const current = (byId ?? state.byId).get(row.id);
            if (current && !isNewerVersion(row, current)) continue;

            byId ??= new Map(state.byId);
            byId.set(row.id, row);
            if (!current) {
                added.push(row);
                continue;
            }

            // A newer version of a message we already have
            const addedAt = added.indexOf(current);
            if (addedAt !== -1) {
                added[addedAt] = row; // the same message twice in one batch
                continue;
            }
            list ??= [...state.list];
            const at = indexOfSorted(list, current);
            if (at !== -1 && createdMs(row) === createdMs(current)) {
                list[at] = row; // same place in the order
            } else {
                if (at !== -1) list.splice(at, 1);
                added.push(row);
            }
        }

        if (!byId) return state;
        list ??= [...state.list];
        if (added.length > 0) {
            added.sort(compareCreated);
            const last = list[list.length - 1];
            for (const row of added) list.push(row);
            if (last && compareCreated(last, added[0]) > 0) list.sort(compareCreated);
        }
        return {list, byId, cursor: state.cursor};
    },

    // Drops a hard-deleted message; the same state comes back when the list doesn't have it
    removeMessage(state: MessageState, id: string): MessageState {
        const current = state.byId.get(id);
        if (!current) return state;
        const byId = new Map(state.byId);
        byId.delete(id);
        const list = [...state.list];
        const at = indexOfSorted(list, current);
        if (at !== -1) list.splice(at, 1);
        return {list, byId, cursor: state.cursor};
    },

    // The sync cursor after a fetch: the newest updatedAt among the fetched rows, kept as the server's exact string
    advanceCursor(cursor: string | null, rows: CachedMessage[]): string | null {
        let newest = cursor;
        let newestUs = cursor === null ? Number.NEGATIVE_INFINITY : timestampUs(cursor);
        for (const row of rows) {
            const us = updatedUs(row);
            if (us > newestUs) {
                newest = row.updatedAt;
                newestUs = us;
            }
        }
        return newest;
    },
};

export default msgArrayManipulation;
