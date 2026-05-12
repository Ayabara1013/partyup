export default function PlayerSettingDisplay({game, settings}: { game: any, settings: any }) {
    let talkingStickDisplay = <div className={`btn btn-disabled pointer-events-none`}>None</div>

    for (let player of game.players) {
        if (settings.talkingStick === player.id) {
            talkingStickDisplay = <div className={`btn btn-primary pointer-events-none`}>{player.name}</div>
        }
    }

    return (
        <div className='tool-row__element '>
            <div className={`chat-window__header uppercase`}>
                <p>Player - Setting Display</p>
            </div>
            <div className={`message-area flex-col flex-auto h-full overflow-y-hidden`}>
                <div className='message-container flex-auto overflow-y-scroll'>
                    {talkingStickDisplay}
                </div>
            </div>
        </div>
    )
}