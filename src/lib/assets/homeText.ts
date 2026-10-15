import {dirHref} from "@/lib/routing/directoy";

export type HomeAction = {
    title: string;
    sub: string;
    img: string;
    href: string;
};

export const allText = {
    home: {
        tagline: `Play how you want, when you want. No scheduling conflicts, ever again.`,
        signedOutTitle: `The flexible way to play tabletop RPGs online`,
        signedOutButton: `Log in to get started`,
        actions: [
            {
                title: `Create a game`,
                sub: `Run your own adventure as the GM.`,
                img: `/images/008-spellbook-1.png`,
                href: dirHref.games.create,
            },
            {
                title: `Discover games`,
                sub: `Find an open table that fits you.`,
                img: `/images/038-adventure-1.png`,
                href: dirHref.discover,
            },
            {
                title: `Invite your friends`,
                sub: `Share an invite link from Your Games.`,
                img: `/images/042-epidemiology.png`,
                href: dirHref.games.root,
            },
            {
                title: `Play anytime`,
                sub: `Take turns in chat, at your own pace.`,
                img: `/images/058-watching-tv.png`,
                href: dirHref.games.root,
            },
        ] satisfies HomeAction[],
    },
}
