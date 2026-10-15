import {supabaseInGame} from "@/lib/supabase/db/inGame";

export default function GMTools({game, settings}: { game: any, settings: any }) {
    const players: any[] = game.players ?? [];

    return (
        <section className='panel tool-row__element'>
            <header className='panel__bar'>
                <div className='panel__title'>
                    <span className='panel__name'>GM Tools</span>
                    <span className='panel__desc'>Talking stick</span>
                </div>
            </header>
            <div className='panel__body'>
                {players.length === 0
                    ? <p className='panel__hint'>No players have joined yet.</p>
                    : <>
                        <div className='flex flex-wrap gap-2'>
                            {players.map((player: any) => {
                                const hasTalkingStick = settings.talkingStick === player.id;
                                return (
                                    <button key={player.id}
                                            className={`btn btn-sm ${hasTalkingStick ? `btn-primary` : `btn-ghost border border-neutral-content/20`}`}
                                            aria-pressed={hasTalkingStick}
                                            onClick={() => supabaseInGame.set.talkingStick(game.id, hasTalkingStick ? `` : player.id)}>
                                        {player.name}
                                    </button>
                                );
                            })}
                        </div>
                        <p className='panel__hint'>Click a player to hand them the talking stick, or again to take it back.</p>
                    </>
                }
            </div>
        </section>
    )
}
