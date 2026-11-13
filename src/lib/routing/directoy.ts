export const domainHref = process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:3000`;

export const dirHref = {
    discover: `/discover`,
    home: `/home`,
    games: {
        root: `/games/your-games`,
        create: `/games/create`,
        inviteLink: (inviteCode: string) => `${domainHref}/games/invite/${inviteCode}`,
        play: (gameId: string) => `/games/play/${gameId}`,
        edit: (gameId: string) => `/games/edit/${gameId}`,
    },
    user: {
        profile: `/user/profile`,
        signin: `/auth/login`,
        settings: `/user/settings`,
    },
} as const;