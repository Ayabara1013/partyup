'use client';

import {useCallback, useEffect, useRef, useState} from "react";
import {supabase} from "@/lib/supabase/client/client";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import {CachedMessage, lsInGame, slimMessage} from "@/lib/util/localStorage";
import msgArrayManipulation, {MessageState} from "@/lib/supabase/util/msgArrayManipulation";

const EMPTY: MessageState = {list: [], byId: new Map(), cursor: null};

// The saved copy is written this long after the last change (and right away when the page is hidden)
const SAVE_DELAY_MS = 1000;

// A catch-up starts this long before the cursor: updated_at is the time a transaction started, so a row with a
// slightly older time can commit after the cursor was taken. Rows fetched twice are merged by id.
const CATCH_UP_OVERLAP_MS = 10_000;

// After a failed catch-up the next try waits this long, doubling per failure up to the maximum
const RETRY_FIRST_MS = 5_000;
const RETRY_MAX_MS = 60_000;

// Where a catch-up starts: everything without a (readable) cursor, else just before it
function catchUpStart(cursor: string | null): string | null {
    const ms = cursor === null ? NaN : Date.parse(cursor);
    return Number.isNaN(ms) ? null : new Date(ms - CATCH_UP_OVERLAP_MS).toISOString();
}

// The game's chat (every channel): oldest first, indexed by message id.
// The list lives in memory; localStorage only keeps a copy for the next visit.
export function useGameMessages(gameId: string, enabled: boolean) {
    const [state, setState] = useState<MessageState>(EMPTY);
    const loadedFor = useRef<string | null>(null);
    const pendingSave = useRef<MessageState | null>(null);

    // Where the next catch-up starts (state.cursor is the copy saved together with the list)
    const cursor = useRef<string | null>(null);
    // One catch-up at a time: a request while one runs makes it run once more, and waits for that
    const running = useRef<Promise<void> | null>(null);
    const runAgain = useRef(false);
    // Bumped by "Clear Local Messages", so a catch-up already under way drops its result
    const generation = useRef(0);
    // Ids of hard-deleted messages: a fetch that started before the delete must not bring them back
    const deletedIds = useRef(new Set<string>());
    // A failed catch-up is tried again on a timer (also when the realtime connection stays up)
    const retryTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const failures = useRef(0);
    const catchUpRef = useRef<() => Promise<void>>(async () => {});
    // True while the realtime effect is set up, so no retry is scheduled after leaving the page
    const active = useRef(false);

    // Every row is kept with only the fields the chat reads (realtime rows arrive with every column)
    const merge = useCallback((rows: CachedMessage[]) =>
        setState((prev) => msgArrayManipulation.mergeMessages(prev, rows.map(slimMessage))), []);

    const remove = useCallback((id: string) => {
        deletedIds.current.add(id);
        setState((prev) => msgArrayManipulation.removeMessage(prev, id));
    }, []);

    const cancelRetry = useCallback(() => {
        if (retryTimer.current) clearTimeout(retryTimer.current);
        retryTimer.current = null;
    }, []);

    // Fetches what changed since the cursor and merges it. Only fetched rows move the cursor; a failed fetch leaves
    // it alone and is tried again after a delay (or sooner by the next catch-up).
    const catchUp = useCallback((): Promise<void> => {
        cancelRetry();
        if (running.current) {
            runAgain.current = true;
            return running.current;
        }
        const run = (async () => {
            let failed = false;
            try {
                do {
                    runAgain.current = false;
                    const startedIn = generation.current;
                    const fetched = await supabaseInGame.get.messagesSince(gameId, catchUpStart(cursor.current));
                    if (startedIn !== generation.current) continue;
                    failed = !fetched;
                    if (!fetched) continue;
                    failures.current = 0;

                    const rows = fetched.map(slimMessage);
                    const next = msgArrayManipulation.advanceCursor(cursor.current, rows);
                    const kept = rows.filter((row) => !deletedIds.current.has(row.id));
                    cursor.current = next;
                    setState((prev) => {
                        const merged = msgArrayManipulation.mergeMessages(prev, kept);
                        return merged.cursor === next ? merged : {...merged, cursor: next};
                    });
                } while (runAgain.current);
            } finally {
                running.current = null;
            }
            if (failed && active.current) {
                const delay = Math.min(RETRY_FIRST_MS * 2 ** failures.current, RETRY_MAX_MS);
                failures.current += 1;
                retryTimer.current = setTimeout(() => catchUpRef.current(), delay);
            }
        })();
        running.current = run;
        return run;
    }, [gameId, cancelRetry]);

    useEffect(() => {
        catchUpRef.current = catchUp;
    }, [catchUp]);

    // Cached copy first, then a catch-up from its cursor (everything when there is no copy)
    const load = useCallback(async () => {
        lsInGame.clear.legacy();
        const saved = lsInGame.get.chatLog(gameId);
        cursor.current = saved.cursor;
        setState((prev) => ({
            ...msgArrayManipulation.mergeMessages(prev, saved.messages.map(slimMessage)),
            cursor: saved.cursor
        }));
        await catchUp();
    }, [gameId, catchUp]);

    // Once per game, as soon as the page knows the visitor belongs to it
    useEffect(() => {
        if (!enabled || loadedFor.current === gameId) return;
        loadedFor.current = gameId;
        // Shows the cached copy right away (one extra render, once per game), then merges what the fetch returns
        load();
    }, [enabled, gameId, load]);

    // Realtime: rows are merged, hard deletes removed. Every (re)join and every return to the tab runs a catch-up, so
    // messages sent before the subscription started or while the connection was down are still fetched.
    useEffect(() => {
        if (!enabled) return;
        active.current = true;
        const channel = supabaseInGame.live.messages(gameId, {change: merge, delete: remove, subscribed: catchUp});
        const onVisibility = () => {
            if (document.visibilityState === `visible`) catchUp();
        };
        document.addEventListener(`visibilitychange`, onVisibility);
        return () => {
            active.current = false;
            cancelRetry();
            document.removeEventListener(`visibilitychange`, onVisibility);
            supabase.removeChannel(channel);
        };
    }, [enabled, gameId, merge, remove, catchUp, cancelRetry]);

    const saveNow = useCallback(() => {
        const toSave = pendingSave.current;
        if (!toSave) return;
        lsInGame.set.chatLog(gameId, toSave.list, toSave.cursor);
        pendingSave.current = null;
    }, [gameId]);

    useEffect(() => {
        if (state.list.length === 0) return;
        pendingSave.current = state;
        const timer = setTimeout(saveNow, SAVE_DELAY_MS);
        return () => clearTimeout(timer);
    }, [state, saveNow]);

    useEffect(() => {
        const onVisibility = () => {
            if (document.visibilityState === `hidden`) saveNow();
        };
        document.addEventListener(`visibilitychange`, onVisibility);
        window.addEventListener(`pagehide`, saveNow);
        return () => {
            document.removeEventListener(`visibilitychange`, onVisibility);
            window.removeEventListener(`pagehide`, saveNow);
            saveNow(); // leaving the play page
        };
    }, [saveNow]);

    // "Clear Local Messages": forget the saved copy and download every message again
    const reload = useCallback(async () => {
        generation.current += 1;
        pendingSave.current = null;
        cursor.current = null;
        lsInGame.clear.chatLog(gameId);
        setState(EMPTY);
        await load();
    }, [gameId, load]);

    return {messages: state.list, messagesById: state.byId, reload};
}
