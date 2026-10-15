'use client'

import '@/styles/home.scss';
import {useMemo} from "react";
import Link from "next/link";
import Image from "next/image";
import {useAuthManager} from "@/app/(context)/authContext";
import HomeActionCard from "@/app/home/(components)/HomeActionCard";
import {allText} from "@/lib/assets/homeText";
import {dirHref} from "@/lib/routing/directoy";
import {gameSystems} from "@/lib/assets/gameSystems";

export default function Home() {
    const {user, userLoading, gmGames, playerGames, gamesLoading} = useAuthManager();

    // Games already in progress, GM games first; built from the lists the auth context already loaded
    const activeGames = useMemo(() => [
        ...gmGames.filter((g) => g.started).map((game) => ({game, role: `GM`})),
        ...playerGames.filter((g) => g.started).map((game) => ({game, role: `Player`})),
    ], [gmGames, playerGames]);

    if (!userLoading && !user) return <SignedOut/>;

    const name = user?.userMetadata?.name;

    return (
        <div className="home">
            <section className="panel home__hero">
                <div className="home__hero-body">
                    <h1 className="home__greeting">{name ? `Welcome back, ${name}` : `Welcome back`}</h1>
                    <p className="home__tagline">{allText.home.tagline}</p>
                </div>
            </section>

            <div className="home__actions">
                {allText.home.actions.map((action) => <HomeActionCard key={action.title} action={action}/>)}
            </div>

            <section className="panel home__active">
                <header className="panel__bar">
                    <div className="panel__title">
                        <span className="panel__name">Jump back in</span>
                        {!gamesLoading &&
                          <span className="panel__desc">{activeGames.length} in progress</span>}
                    </div>
                    <Link href={dirHref.games.root} className="btn btn-sm btn-ghost border border-neutral-content/20">
                        Your games
                    </Link>
                </header>
                <div className="panel__body">
                    {gamesLoading
                        ? <div className="flex justify-center py-6"><span className="loading loading-dots loading-md"/></div>
                        : activeGames.length === 0
                            ? <p className="panel__hint py-4 text-center">
                                None of your games have started yet. <Link href={dirHref.discover} className="link link-primary">Find a game</Link> or start one from Your Games.
                            </p>
                            : <ul className="home__active-list">
                                {activeGames.map(({game, role}) =>
                                    <li key={game.id} className="home__active-item">
                                        <span className="home__active-name">{game.name}</span>
                                        <span className="badge badge-ghost badge-sm">{gameSystems.valueToTitle[game.system] ?? game.system}</span>
                                        <span className={`badge badge-sm ${role === `GM` ? `badge-primary` : `badge-primary badge-outline`}`}>{role}</span>
                                        <Link href={dirHref.games.play(game.id)} className="btn btn-sm btn-primary ml-auto">Play</Link>
                                    </li>
                                )}
                            </ul>
                    }
                </div>
            </section>
        </div>
    )
}

// Signed-out visitors are normally redirected to the login page by the auth context; this covers the moment before
function SignedOut() {
    return (
        <div className="home">
            <section className="panel home__hero home__hero--signed-out">
                <div className="home__hero-body">
                    <h1 className="home__greeting">{allText.home.signedOutTitle}</h1>
                    <p className="home__tagline">{allText.home.tagline}</p>
                    <Link href="/auth/login" className="btn btn-primary self-start">{allText.home.signedOutButton}</Link>
                </div>
                <Image className="home__hero-image" src="/images/example-play-screens-mobile-1x.png" alt="PartyUp on a phone"
                       width={571} height={756} priority/>
            </section>
        </div>
    )
}
