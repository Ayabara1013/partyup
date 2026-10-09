export const domainHref = process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:3000`;

export const dirHref = {
    discover: `/discover`,
    error: `/error`,
    home: `/home`,
    playPrefix: `/play`,
    community: {
        root: `/community`,
        create: `/community/create`,
    },
    games: {
        root: `/games/your-games`,
        create: `/games/create`,
        join: (inviteCode: string) => `/games/invite/${inviteCode}`,
        inviteLink: (inviteCode: string) => `${domainHref}/games/invite/${inviteCode}`,
        play: (gameId: string) => `/games/play/${gameId}`,
        edit: (gameId: string) => `/games/edit/${gameId}`,
    },
    user: {
        chooseDisplayName: `/user/choose-display-name`,
        signin: `/user/signin`,
        signup: `/user/signup`,
        settings: `/user/settings`,
        subscription: `/user/subscription`,
        update: `/user/update`,
    },
} as const;