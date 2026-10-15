// Where to send someone after they sign in (the `next` query param on /auth/login and the OAuth route).

const DEFAULT_NEXT = `/home`;

// Only same-site paths: "/games/invite/abc" is fine; "//evil.com", "/\evil.com" or "https://..." fall back to the default
export function safeNextPath(next: string | null | undefined): string {
    if (!next || !next.startsWith(`/`) || next.startsWith(`//`) || next.startsWith(`/\\`)) return DEFAULT_NEXT;
    if (next.startsWith(`/auth`)) return DEFAULT_NEXT; // never bounce back into the sign-in pages
    return next;
}

// /auth/login, remembering the page the visitor was trying to reach
export function loginHref(from?: string): string {
    const next = safeNextPath(from);
    return next === DEFAULT_NEXT ? `/auth/login` : `/auth/login?next=${encodeURIComponent(next)}`;
}
