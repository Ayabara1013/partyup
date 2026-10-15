'use client'

import '@/styles/discover/discover.scss';
import {useEffect, useRef, useState} from "react";
import {useAuthManager} from "@/app/(context)/authContext";
import {supabaseGame} from "@/lib/supabase/db/game";
import DiscoverGameCard from "@/app/discover/(components)/DiscoverGameCard";
import DiscoverFilters, {DEFAULT_FILTERS, DiscoverFilterState} from "@/app/discover/(components)/DiscoverFilters";

// Wait this long after the last filter change before searching
const SEARCH_DELAY_MS = 300;

export default function Discover() {
    const {user} = useAuthManager();
    const [filters, setFilters] = useState<DiscoverFilterState>(DEFAULT_FILTERS);
    const [games, setGames] = useState<any[]>([]);
    const [status, setStatus] = useState<`loading` | `ready` | `error`>(`loading`);
    const requestId = useRef(0);

    // Refetch when the filters change (debounced); responses from older requests are ignored
    useEffect(() => {
        const id = ++requestId.current;
        const timer = setTimeout(async () => {
            setStatus(`loading`);
            const result = await supabaseGame.get.game.publicGameList({...filters, userId: user?.id});
            if (id !== requestId.current) return;
            setGames(result ?? []);
            setStatus(result ? `ready` : `error`);
        }, SEARCH_DELAY_MS);
        return () => clearTimeout(timer);
    }, [filters, user?.id]);

    return (
        <div className="discover">
            <DiscoverFilters filters={filters} onChange={setFilters}/>

            <section className="panel discover__results">
                <header className="panel__bar">
                    <div className="panel__title">
                        <span className="panel__name">Discover</span>
                        {status === `ready` &&
                          <span className="panel__desc">{games.length} open {games.length === 1 ? `game` : `games`}</span>}
                    </div>
                </header>

                <div className="panel__body">
                    {status === `loading` && games.length === 0
                        ? <div className="flex justify-center py-8"><span className="loading loading-dots loading-md"/></div>
                        : status === `error`
                            ? <p className="panel__hint py-6 text-center">Couldn&apos;t load games. Try again in a moment.</p>
                            : games.length === 0
                                ? <p className="panel__hint py-6 text-center">No open games match these filters.</p>
                                : <div className={`discover__grid ${status === `loading` ? `discover__grid--stale` : ``}`}>
                                    {games.map((game) => <DiscoverGameCard key={game.id} game={game} userId={user?.id}/>)}
                                </div>
                    }
                </div>
            </section>
        </div>
    )
}
