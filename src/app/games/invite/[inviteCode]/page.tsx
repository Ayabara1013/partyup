"use client"

import '@/styles/discover/discover.scss';
import '@/styles/games/invite.scss';
import {use, useEffect, useState} from "react";
import Link from "next/link";
import {useAuthManager} from "@/app/(context)/authContext";
import {dirHref} from "@/lib/routing/directoy";
import {supabaseGame} from "@/lib/supabase/db/game";
import DiscoverGameCard from "@/app/discover/(components)/DiscoverGameCard";

type PageProps = {
    params: Promise<{ inviteCode: string }>;
};

export default function InvitePage({params}: PageProps) {
    const {inviteCode} = use(params);
    const {user} = useAuthManager();
    const userId = user?.id;
    const [game, setGame] = useState<any | null>(null);
    const [status, setStatus] = useState<`loading` | `ready` | `missing`>(`loading`);

    useEffect(() => {
        if (!userId) return; // the auth context sends signed-out visitors to the login page
        let cancelled = false;
        supabaseGame.get.game.fromInvite(inviteCode, userId).then((result) => {
            if (cancelled) return;
            setGame(result);
            setStatus(result ? `ready` : `missing`);
        });
        return () => {
            cancelled = true;
        };
    }, [inviteCode, userId]);

    const isMember = !!game && (game.gmUid === userId || game.players.some((p: any) => p.id === userId));

    return (
        <div className="invite-page">
            <section className="panel invite">
                <header className="panel__bar">
                    <div className="panel__title">
                        <span className="panel__name">You&apos;re invited</span>
                        <span className="panel__desc">to a game on PartyUp</span>
                    </div>
                </header>

                <div className="panel__body">
                    {status === `loading`
                        ? <div className="flex justify-center py-8"><span className="loading loading-dots loading-md"/></div>
                        : status === `missing`
                            ? <p className="panel__hint py-6 text-center">
                                This invite link doesn&apos;t match any game. It may have been mistyped, or the game was deleted.
                            </p>
                            : <DiscoverGameCard game={game} userId={userId}/>
                    }
                </div>

                <footer className="invite__footer">
                    {status === `missing`
                        ? <Link href={dirHref.discover} className="btn btn-sm btn-primary">Discover games</Link>
                        : <>
                            <Link href={dirHref.games.root} className="btn btn-sm btn-ghost border border-neutral-content/20">
                                Your games
                            </Link>
                            {isMember && game.started &&
                              <Link href={dirHref.games.play(game.id)} className="btn btn-sm btn-primary">Play</Link>}
                        </>
                    }
                </footer>
            </section>
        </div>
    )
}
