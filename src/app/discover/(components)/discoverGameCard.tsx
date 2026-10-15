import {memo, useState} from "react";
import toast from "react-hot-toast";
import timeSince from "@/lib/util/timeSince";
import {gameSystems} from "@/lib/assets/gameSystems";
import {safetyChecks} from "@/lib/assets/safetyChecks";
import {supabaseGame} from "@/lib/supabase/db/game";

// Safety tool columns on `game`, in the same order as safetyChecks.array
const SAFETY_COLUMNS = [`sc0`, `sc1`, `sc2`, `sc3`] as const;

type DiscoverGameCardProps = {
    game: any;
    userId: string | undefined;
};

export default memo(function DiscoverGameCard({game, userId}: DiscoverGameCardProps) {
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);
    const requested = sent || !!game.requested;

    const players: any[] = game.players ?? [];
    const openSeats = Math.max(game.maxPlayers - players.length, 0);
    const isGm = game.gmUid === userId;
    const isPlayer = players.some((p) => p.id === userId);
    const tools = SAFETY_COLUMNS.flatMap((column, i) => game[column] ? [safetyChecks.array[i].title] : []);
    const age = timeSince(game.createdAt, `conversational`);

    const requestToJoin = async () => {
        if (!userId) return;
        setSending(true);
        const ok = await supabaseGame.set.join(game.id, userId);
        setSending(false);
        if (ok) {
            setSent(true);
            toast.success(`Request sent to ${game.gm?.name ?? `the GM`}.`);
        } else {
            toast.error(`Could not send a join request.`);
        }
    };

    return (
        <article className="discover-card">
            <div className="discover-card__top">
                <div className="discover-card__info">
                    <span className="discover-card__name">{game.name}</span>
                    <span className="badge badge-ghost badge-sm">{gameSystems.valueToTitle[game.system] ?? game.system}</span>
                    {game.ageRestriction > 10 && <span className="badge badge-warning badge-outline badge-sm">{game.ageRestriction}+</span>}
                </div>
                <div className="discover-card__action">
                    {isGm ? <span className="badge badge-ghost">Your game</span>
                        : isPlayer ? <span className="badge badge-primary badge-outline">Joined</span>
                            : openSeats === 0 ? <span className="badge badge-ghost">Full</span>
                                : requested ? <span className="badge badge-ghost">Request sent</span>
                                    : <button className="btn btn-sm btn-primary" onClick={requestToJoin} disabled={sending}>
                                        {sending ? <span className="loading loading-spinner loading-xs"/> : `Request to join`}
                                    </button>}
                </div>
            </div>

            <div className="discover-card__meta">
                <GmAvatar gm={game.gm}/>
                <span>GM <strong>{game.gm?.name ?? `Unknown`}</strong></span>
                <span aria-hidden>·</span>
                <span>{age === `today` ? `Created today` : `Created ${age} ago`}</span>
            </div>

            {game.description && <p className="discover-card__description">{game.description}</p>}

            <div className="discover-card__seats">
                <span className="discover-card__count">{players.length} / {game.maxPlayers}</span>
                <ul className="seat-list">
                    {players.map((player) =>
                        <li key={player.id} className={`seat ${player.id === userId ? `seat--you` : `seat--filled`}`}>
                            {player.name}
                        </li>)}
                    {openSeats > 0 && <li className="seat seat--empty">{openSeats} open {openSeats === 1 ? `seat` : `seats`}</li>}
                </ul>
            </div>

            {(tools.length > 0 || game.tags?.length > 0) &&
              <div className="discover-card__chips">
                  {tools.map((tool) => <span key={tool} className="badge badge-success badge-outline badge-sm">{tool}</span>)}
                  {(game.tags ?? []).map((tag: string) => <span key={tag} className="badge badge-ghost badge-sm">#{tag}</span>)}
              </div>
            }
        </article>
    );
});

function GmAvatar({gm}: { gm: any }) {
    if (gm?.imageUrl) {
        return <img className="discover-card__avatar" src={gm.imageUrl} alt="" loading="lazy" referrerPolicy="no-referrer"/>;
    }
    return <span className="discover-card__avatar discover-card__avatar--fallback">{(gm?.name ?? `?`).charAt(0).toUpperCase()}</span>;
}
