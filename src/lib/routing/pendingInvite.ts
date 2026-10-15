// An invite link opened while signed out is remembered here, so the visitor lands back on it after signing in
// even if the sign-in round trip drops the `next` query param.

const KEY = `partyup:pendingInvite`;
const INVITE_PATH = /^\/games\/invite\/[^/?#]+$/;

export const pendingInvite = {
    // Only invite paths are stored; anything else is ignored
    save(path: string) {
        if (!INVITE_PATH.test(path)) return;
        try {
            localStorage.setItem(KEY, path);
        } catch {
            // storage blocked: the `next` query param still covers the common case
        }
    },

    // Returns the stored invite path (if any) and forgets it
    take(): string | null {
        try {
            const path = localStorage.getItem(KEY);
            localStorage.removeItem(KEY);
            return path && INVITE_PATH.test(path) ? path : null;
        } catch {
            return null;
        }
    },
};
