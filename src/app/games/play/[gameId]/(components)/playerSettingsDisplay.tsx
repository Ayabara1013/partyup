export default function PlayerSettingDisplay({game, settings}: { game: any, settings: any }) {
    const holder = (game.players ?? []).find((player: any) => settings.talkingStick === player.id);

    return (
        <section className='panel tool-row__element'>
            <header className='panel__bar'>
                <div className='panel__title'>
                    <span className='panel__name'>Turn</span>
                    <span className='panel__desc'>Talking stick</span>
                </div>
            </header>
            <div className='panel__body'>
                {holder
                    ? <div className='flex items-center gap-2'>
                        <span className='badge badge-primary badge-lg font-semibold'>{holder.name}</span>
                        <span className='panel__hint'>has the talking stick</span>
                    </div>
                    : <p className='panel__hint'>Nobody has the talking stick right now.</p>
                }
            </div>
        </section>
    )
}
