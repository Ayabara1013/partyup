import {memo, ReactNode} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";
import {dirHref} from "@/lib/routing/directoy";
import {usePopupModal} from "@/app/(context)/popupModalContext";
import JoinRequestList from "@/app/games/your-games/(components)/joinRequestList";
import {supabaseGame} from "@/lib/supabase/db/game";

// Below this many players a game shows its seat count as a warning
const MIN_PLAYERS = 2;

type MyGamesListProps = {
    type: `gm` | `player`;
    games: any[];
    loading: boolean;
    userId: string | undefined;
    updateGames: () => Promise<void>;
    action: ReactNode;
    empty: string;
};

export default function MyGamesList({type, games, loading, userId, updateGames, action, empty}: MyGamesListProps) {
    const title = type === `gm` ? `GM Games` : `Player Games`;

    return (
        <section className="panel games-dashboard__panel">
            <header className="panel__bar">
                <div className="panel__title">
                    <span className="panel__name">{title}</span>
                    {!loading && <span className="panel__desc">{games.length} {games.length === 1 ? `game` : `games`}</span>}
                </div>
                {action}
            </header>
            <div className="panel__body">
                {loading
                    ? <div className="flex justify-center py-6"><span className="loading loading-dots loading-md"/></div>
                    : games.length === 0
                        ? <p className="panel__hint py-4 text-center">{empty}</p>
                        : games.map((game) =>
                            <GameCard key={game.id} game={game} isGm={type === `gm`} userId={userId}
                                      updateGames={updateGames}/>)
                }
            </div>
        </section>
    )
}

type GameCardProps = {
    game: any;
    isGm: boolean;
    userId: string | undefined;
    updateGames: () => Promise<void>;
};

const GameCard = memo(function GameCard({game, isGm, userId, updateGames}: GameCardProps) {
    const players: any[] = game.players ?? [];
    const seats: number = game.maxPlayers;
    const countClass = players.length >= seats ? `text-success` : players.length < MIN_PLAYERS ? `text-warning` : ``;

    return (
        <article className="game-card">
            <div className="game-card__top">
                <div className="game-card__info">
                    <span className="game-card__name">{game.name}</span>
                    <span className="badge badge-ghost badge-sm uppercase">{game.system}</span>
                    <span className={`badge badge-sm ${game.started ? `badge-success badge-outline` : `badge-ghost`}`}>
                        {game.started ? `In progress` : `Not started`}
                    </span>
                    {!isGm && game.gm && <span className="game-card__gm">GM: {game.gm.name}</span>}
                </div>
                <GameActions game={game} isGm={isGm} updateGames={updateGames}/>
            </div>

            <div className="game-card__seats">
                <span className={`game-card__count ${countClass}`}>{players.length} / {seats}</span>
                <SeatList game={game} players={players} seats={seats} userId={userId}/>
            </div>
        </article>
    )
});

function SeatList({game, players, seats, userId}: { game: any, players: any[], seats: number, userId: string | undefined }) {
    const copyInvite = async () => {
        await navigator.clipboard.writeText(dirHref.games.inviteLink(game.inviteCode));
        toast(`Copied invite link`);
    };

    const openSeats = Math.max(seats - players.length, 0);

    return (
        <ul className="seat-list">
            {players.map((player, i) =>
                <li key={player.id}
                    className={`seat ${i >= seats ? `seat--over` : player.id === userId ? `seat--you` : `seat--filled`}`}>
                    {player.name}{player.id === userId ? ` (you)` : ``}
                </li>
            )}
            {Array.from({length: openSeats}, (_, i) =>
                <li key={`open-${i}`}>
                    {game.started
                        ? <span className="seat seat--empty">Empty</span>
                        : <button className="seat seat--open" onClick={copyInvite} title="Copy invite link">Invite</button>}
                </li>
            )}
        </ul>
    )
}

function GameActions({game, isGm, updateGames}: { game: any, isGm: boolean, updateGames: () => Promise<void> }) {
    const {push} = useRouter();
    const {showModal, setTitle, setModalChildren} = usePopupModal();
    const requestCount: number = game.joinRequests?.length ?? 0;

    const startGame = async () => {
        if (!await supabaseGame.set.edit.startGame(game.id)) {
            toast.error(`${game.name} failed to start!`);
            return;
        }
        updateGames();
        push(dirHref.games.play(game.id));
    };

    const showJoinRequests = () => {
        setTitle(`Join requests`);
        // Fresh key per open, so the list never keeps another game's (or a stale) request state
        setModalChildren(<JoinRequestList key={`${game.id}-${Date.now()}`} game={game} onAccepted={updateGames}/>);
        showModal();
    };

    const subtleButton = `btn btn-sm btn-ghost border border-neutral-content/20`;

    return (
        <div className="game-card__actions">
            {isGm && !game.started &&
              <button className={subtleButton} onClick={showJoinRequests} disabled={requestCount === 0}>
                Join requests
                {requestCount > 0 && <span className="badge badge-sm badge-primary">{requestCount}</span>}
              </button>
            }
            {isGm && <Link href={dirHref.games.edit(game.id)} className={subtleButton}>Edit</Link>}
            {game.started
                ? <Link href={dirHref.games.play(game.id)} className="btn btn-sm btn-primary">Play</Link>
                : isGm && <button className="btn btn-sm btn-primary" onClick={startGame}>Start</button>}
        </div>
    )
}
