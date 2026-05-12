import {supabaseInGame} from "@/lib/supabase/db/inGame";

export default function GMTools({game, settings}: { game: any, settings: any }) {
    const playerButtons: Array<any> = [];

    game.players.forEach((player: any, index: number) => {
        let hasTalkingStick = settings.talkingStick === player.id;

        function onClick() {
            supabaseInGame.set.talkingStick(game.id, hasTalkingStick ? `` : player.id)
        }

        playerButtons.push(
            <button className={`btn ${hasTalkingStick ? `btn-primary` : ``}`}
                    key={index} value={player.id} onClick={onClick}>
                {player.name}
            </button>)
    })

    return (
        <div className='tool-row__element '>
            <div className={`chat-window__header uppercase`}>
                <p>Dev - GM tools</p>
            </div>
            <div className={`message-area flex-col flex-auto h-full overflow-y-hidden`}>
                <div className='message-container flex-auto overflow-y-scroll'>
                    {playerButtons}
                </div>
            </div>
        </div>
    )
}