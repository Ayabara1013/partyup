export const dirHref = {
    discover: `/discover`,
    home: `/home`,
    games: {
        root: `/games/your-games`,
        create: `/games/create`,
        // The hosted address when NEXT_PUBLIC_SITE_URL is set (so a link copied on localhost still points to the live
        // site), else the page's own address (call it in the browser only)
        inviteLink: (inviteCode: string) =>
            `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/games/invite/${inviteCode}`,
        play: (gameId: string) => `/games/play/${gameId}`,
        edit: (gameId: string) => `/games/edit/${gameId}`,
    },
    user: {
        profile: `/user/profile`,
        signin: `/auth/login`,
        settings: `/user/settings`,
    },
} as const;