'use client'

import '@/styles/discover/discover.scss';
import {useEffect, useRef, useState} from "react";
import toast from "react-hot-toast";
import {useAuthManager} from "@/app/(context)/authContext";
import {supabaseGame} from "@/lib/supabase/db/game";
import DiscoverGameCard from "@/app/discover/(components)/discoverGameCard";
import DiscoverFilters, {DEFAULT_FILTERS, DiscoverFilterState} from "@/app/discover/(components)/discoverFilters";

// Games per page; "Show more" loads the next page
const PAGE_SIZE = 24;
// Wait this long after the last change to the search text before searching
const SEARCH_DELAY_MS = 300;

export default function Discover() {
    const {user, userLoading} = useAuthManager();
    const userId = user?.id;
    const [filters, setFilters] = useState<DiscoverFilterState>(DEFAULT_FILTERS);
    const [games, setGames] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(false);
    // The filters behind the list on screen: "Show more" continues that list
    const [shown, setShown] = useState<DiscoverFilterState | null>(null);
    const [status, setStatus] = useState<`loading` | `ready` | `error`>(`loading`);
    const [loadingMore, setLoadingMore] = useState(false);
    const requestId = useRef(0);
    const lastSearch = useRef<string | null>(null);

    // The first page: once sign-in has finished (so "Request sent" is right from the start), and again on every
    // filter change. Only a changed search text waits; responses from older requests are ignored.
    useEffect(() => {
        if (userLoading) return;
        const id = ++requestId.current;
        const delay = lastSearch.current !== null && filters.search !== lastSearch.current ? SEARCH_DELAY_MS : 0;
        lastSearch.current = filters.search;
        const timer = setTimeout(async () => {
            setStatus(`loading`);
            const result = await supabaseGame.get.game.publicGameList({...filters, userId, offset: 0, pageSize: PAGE_SIZE});
            if (id !== requestId.current) return;
            setGames(result?.games ?? []);
            setHasMore(!!result?.hasMore);
            setShown(filters);
            setLoadingMore(false);
            setStatus(result ? `ready` : `error`);
        }, delay);
        return () => clearTimeout(timer);
    }, [filters, userId, userLoading]);

    // The next page of the list on screen; dropped if the filters change meanwhile
    const showMore = async () => {
        if (!shown) return;
        const id = requestId.current;
        setLoadingMore(true);
        const result = await supabaseGame.get.game.publicGameList({...shown, userId, offset: games.length, pageSize: PAGE_SIZE});
        if (id !== requestId.current) return;
        setLoadingMore(false);
        if (!result) {
            toast.error(`Couldn't load more games.`);
            return;
        }
        // A game opened since the last page shifts the list by one: skip the repeat
        setGames((prev) => {
            const seen = new Set(prev.map((game) => game.id));
            return [...prev, ...result.games.filter((game) => !seen.has(game.id))];
        });
        setHasMore(result.hasMore);
    };

    return (
        <div className="discover">
            <DiscoverFilters filters={filters} onChange={setFilters}/>

            <section className="panel discover__results">
                <header className="panel__bar">
                    <div className="panel__title">
                        <span className="panel__name">Discover</span>
                        {/* "24+" while more games may follow */}
                        {status === `ready` &&
                          <span className="panel__desc">
                              {games.length}{hasMore ? `+` : ``} open {games.length === 1 && !hasMore ? `game` : `games`}
                          </span>}
                    </div>
                </header>

                <div className="panel__body">
                    {status === `loading` && games.length === 0
                        ? <div className="flex justify-center py-8"><span className="loading loading-dots loading-md"/></div>
                        : status === `error`
                            ? <p className="panel__hint py-6 text-center">Couldn&apos;t load games. Try again in a moment.</p>
                            : games.length === 0
                                ? <p className="panel__hint py-6 text-center">No open games match these filters.</p>
                                : <>
                                    <div className={`discover__grid ${status === `loading` ? `discover__grid--stale` : ``}`}>
                                        {games.map((game) => <DiscoverGameCard key={game.id} game={game} userId={userId}/>)}
                                    </div>
                                    {/* Hidden while a newer list is on its way, so two searches never mix */}
                                    {hasMore && status === `ready` && shown === filters &&
                                      <div className="flex justify-center pt-3">
                                        <button className="btn btn-sm" onClick={showMore} disabled={loadingMore}>
                                            {loadingMore ? <span className="loading loading-dots loading-xs"/> : `Show more`}
                                        </button>
                                      </div>}
                                </>
                    }
                </div>
            </section>
        </div>
    )
}
