'use client'

import '@/styles/games/play/playerCard.scss';
import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import type {RosterEntry} from "@/lib/supabase/db/character";

type OpenCard = (userId: string, anchor: HTMLElement) => void;

// Only the (stable) open function is shared, so memoized chat messages don't re-render when a card opens or closes
const PlayerCardContext = createContext<OpenCard | null>(null);

// Outside the play page there's no provider: callers fall back to plain, non-clickable text
export const usePlayerCard = () => useContext(PlayerCardContext);

const CARD_WIDTH = 288; // matches .player-card width (18rem)
const GAP = 6;

type CardState = { userId: string, top: number, left: number };

type PlayerCardProviderProps = {
    game: any;
    roster: RosterEntry[];
    currentUserId: string | undefined;
    children: ReactNode;
};

export function PlayerCardProvider({game, roster, currentUserId, children}: PlayerCardProviderProps) {
    const [card, setCard] = useState<CardState | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

    // Below the clicked name, kept inside the window (flips above when there's no room below)
    const open = useCallback<OpenCard>((userId, anchor) => {
        const rect = anchor.getBoundingClientRect();
        const left = Math.min(Math.max(8, rect.left), window.innerWidth - CARD_WIDTH - 8);
        const below = rect.bottom + GAP;
        const top = below + 220 > window.innerHeight ? Math.max(8, rect.top - GAP - 220) : below;
        setCard((current) => current?.userId === userId && current.top === top && current.left === left ? null : {userId, top, left});
    }, []);

    // Close on outside click, Escape, or when the chat scrolls / the window resizes
    useEffect(() => {
        if (!card) return;
        const close = () => setCard(null);
        const onPointerDown = (e: PointerEvent) => {
            const target = e.target as HTMLElement;
            if (cardRef.current?.contains(target) || target.closest(`[data-player-card-trigger]`)) return;
            close();
        };
        const onKey = (e: KeyboardEvent) => e.key === `Escape` && close();
        document.addEventListener(`pointerdown`, onPointerDown);
        document.addEventListener(`keydown`, onKey);
        document.addEventListener(`scroll`, close, true);
        window.addEventListener(`resize`, close);
        return () => {
            document.removeEventListener(`pointerdown`, onPointerDown);
            document.removeEventListener(`keydown`, onKey);
            document.removeEventListener(`scroll`, close, true);
            window.removeEventListener(`resize`, close);
        };
    }, [card]);

    const member = useMemo(() => {
        if (!card || !game) return null;
        if (game.gm?.id === card.userId) return {user: game.gm, isGm: true};
        const player = (game.players ?? []).find((p: any) => p.id === card.userId);
        return player ? {user: player, isGm: false} : null;
    }, [card, game]);

    const seat = card ? roster.find((entry) => entry.userId === card.userId) : undefined;

    return (
        <PlayerCardContext.Provider value={open}>
            {children}
            {card && member &&
              <div ref={cardRef} className="player-card" style={{top: card.top, left: card.left}} role="dialog"
                   aria-label={`${member.user.name}'s profile`}>
                  <PlayerCardContent user={member.user} isGm={member.isGm} isYou={member.user.id === currentUserId}
                                     seat={seat}/>
              </div>
            }
        </PlayerCardContext.Provider>
    );
}

export function PlayerCardContent({user, isGm, isYou, seat}: { user: any, isGm: boolean, isYou: boolean, seat?: RosterEntry }) {
    const character = seat?.character;
    const hp = character?.hitPoints;
    const hpPercent = hp && hp.maximum > 0 ? Math.min(100, Math.max(0, (hp.current / hp.maximum) * 100)) : 0;
    const hpTone = hpPercent > 50 ? `ok` : hpPercent > 25 ? `low` : `critical`;

    return (
        <>
            <header className="player-card__player">
                {user.imageUrl
                    ? <img className="player-card__avatar" src={user.imageUrl} alt="" referrerPolicy="no-referrer"/>
                    : <span className="player-card__avatar player-card__avatar--fallback">{(user.name ?? `?`).charAt(0).toUpperCase()}</span>}
                <div className="player-card__who">
                    <span className="player-card__name">{user.name}{isYou && <span className="player-card__you"> (you)</span>}</span>
                    <span className={`badge badge-sm ${isGm ? `badge-primary` : `badge-primary badge-outline`}`}>{isGm ? `Game Master` : `Player`}</span>
                </div>
            </header>

            {/* The player wraps their character */}
            <div className="player-card__character">
                {isGm
                    ? <p className="panel__hint">Runs this game.</p>
                    : !character
                        ? <p className="panel__hint">No character yet.</p>
                        : <>
                            <div className="player-card__character-name">{character.name}</div>
                            <div className="player-card__line">
                                {[character.lineage, character.className].filter(Boolean).join(` · `) || `—`}
                            </div>
                            <dl className="player-card__facts">
                                <div><dt>Level</dt><dd>{character.level || `—`}</dd></div>
                                <div className="player-card__hp">
                                    <dt>Health</dt>
                                    <dd>
                                        {hp ? <>{hp.current} / {hp.maximum}{hp.temporary > 0 && <span className="player-card__temp"> +{hp.temporary}</span>}</> : `—`}
                                    </dd>
                                </div>
                            </dl>
                            {hp && hp.maximum > 0 &&
                              <div className={`player-card__bar player-card__bar--${hpTone}`} role="meter" aria-label="Health"
                                   aria-valuemin={0} aria-valuemax={hp.maximum} aria-valuenow={hp.current}>
                                  <span style={{width: `${hpPercent}%`}}/>
                              </div>}
                        </>}
            </div>
        </>
    );
}

// Clickable name / avatar / mention that opens a player's card. Without a provider (or a user id) it renders plain.
export function PlayerCardTrigger({userId, className, children}: { userId?: string | null, className?: string, children: ReactNode }) {
    const open = usePlayerCard();
    if (!open || !userId) return <span className={className}>{children}</span>;
    return (
        <button type="button" className={`player-card-trigger ${className ?? ``}`} data-player-card-trigger
                onClick={(e) => {
                    e.stopPropagation();
                    open(userId, e.currentTarget);
                }}>
            {children}
        </button>
    );
}
