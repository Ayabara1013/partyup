export const domainHref = "http://localhost:3000";
export const dirHref: any = {
    discover: '/discover',
    error: '/error',
    home: '/home',
    playPrefix: '/play',
    community: {
        root: `/community`,
        create: `/community/create`
    },
    games: {
        root: '/games/your-games',
        create: '/games/create',
        join: function (gameId: string) {
            return `/games/invite/${gameId}`;
        },
        inviteLink: function (inviteCode: string) {
            return domainHref + `/games/invite/${inviteCode}`;
        },
        play: function (gameId: string) {
            return `/games/play/${gameId}`
        },
        gm: {
            edit: function (gameId: string) {
                return `/games/gm/edit/${gameId}`
            }
        }
    },
    user: {
        chooseDisplayName: `/user/choose-display-name`,
        signin: `/user/signin`,
        signup: `/user/signup`,
        settings: '/user/settings',
        subscription: '/user/subscription',
        update: '/user/update',
    }
}