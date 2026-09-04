import Link from "next/link";
import {dirHref} from "@/lib/routing/directoy";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {usePopupModal} from "@/app/(context)/popupModalContext";
import {useAuthManager} from "@/app/(context)/authContext";
import JoinRequestList from "@/app/games/your-games/(components)/joinRequestList";
import {supabaseGame} from "@/lib/supabase/db/game";


export default function MyGamesList({gameList, type = 'player'}: { gameList: Array<any>, type?: string }) {
    const title = type === 'player' ? 'Player Games' : 'GM Games';
    return (
        <div className=' w-full flex flex-col gap-4 p-4'>
            <div className='text-3xl font-semibold shrink-0 text-center'>{title}</div>
            <div className='games-page__section --games-list h-full overflow-y-auto'>

                <ul className='games-page__games-list'>
                    {gameList.map((game, index) => {
                        return <GameListItem key={index}{...{game, type}}/>
                    })}
                </ul>
            </div>
        </div>
    )
}

function GameListItem({game, type}: { game: any, type: string }) {
    let playerCount = game.players?.length ?? 4
        , totalSeats = game.maxPlayers
        , minSeats = 2;
    let pcs =
        playerCount === totalSeats ? 'text-success'
            : playerCount < minSeats ? 'text-warning'
                : 'text-neutral-content';

    return (
        <div className='games-page__games-list__item'>
            <div className={`flex flex-wrap justify-start items-end gap-x-2`}>
                <div className='text-2xl font-semibold text-primary'>{game.name}</div>
                <div className={`text-opacity-50`}>(System: {game.system})</div>
                {type === `player` ? <div className={`text-opacity-50`}>(GM: {game.gm.name})</div> : <></>}
                <GameListItemOptions {...{game, type}}/>
            </div>

            <div className="flex gap-2">
                <div className={`${pcs} text-xl font-bold whitespace-nowrap`}>{playerCount} / {totalSeats}</div>
                <PlayersList className={`flex-1 my-auto`} {...{game, playerCount, totalSeats}}/>
            </div>
        </div>
    )
}

function PlayersList({className, game}: { className: string, game: any }) {
    let playerCount = game.players?.length ?? 4
    let maxPlayers: number = game.maxPlayers;
    let remainingSeats: number = maxPlayers - playerCount;
    const {user} = useAuthManager();

    async function copyInvite() {
        toast(`Copied invite link`)
        await navigator.clipboard.writeText(dirHref.games.inviteLink(game.inviteCode));
    }

    function FilledSeats() {
        return (game.players ?? []).map((player: any, index: number) => (
            <li className={`__players-list__item ${index >= maxPlayers ? "--error" : "--filled"}`}
                key={index}>
                <p className="pointer-events-none">
                    {player.name}{user?.id === player.id ? " (you)" : ""}
                </p>
            </li>
        ));
    }

    const RemainingSeats = () => {
        return Array.from({length: remainingSeats}, (_, index) => {
            const i = playerCount + index;

            if (game.started) {
                return (
                    <li key={i} className="__players-list__item --empty disabled">
                        <p>Empty</p>
                    </li>
                );
            }

            return (
                <li className={`__players-list__item ${i >= maxPlayers ? "--error" : "--empty"} full-element-btn`}
                    key={i} onClick={copyInvite}>
                    <p>Invite</p>
                </li>
            );
        });
    };
    return (
        <div className={`__players-list ${className}`}>
            <div className='__players-list__list flex flex-row flex-wrap gap-2'>
                <FilledSeats/>
                <RemainingSeats/>
            </div>
        </div>
    )
}

function GameListItemOptions({game, type}: { game: any, type: string }) {
    const {push} = useRouter();
    const {updateGames} = useAuthManager();
    const {showModal, setTitle, setModalChildren} = usePopupModal();

    const startFunc = async () => {
        if (await supabaseGame.set.edit.startGame(game.id)) {
            updateGames()
            setTimeout(() => {
                push(dirHref.games.play(game.id));
            }, 1500)
        } else {
            toast.error(`${game.name} failed to start!`)
        }
    }

    function showModalOnClick() {
        setTitle(`Game join requests`);
        setModalChildren(<JoinRequestList game={game}/>)
        if (game.joinRequests.length > 0) showModal();
        else toast(`No more requests for this game.`);

    }


    function PlayButton() {
        return <Link href={dirHref.games.play(game.id)}
                     className='btn btn-xs btn-accent ml-auto font-semibold'>Play</Link>
    }

    function GMStartButton() {
        return <button onClick={startFunc} className='btn btn-xs btn-accent ml-auto font-semibold'>Start</button>;
    }

    function GMEditButton() {
        return <Link href={dirHref.games.gm.edit(game.id)}
                     className='btn btn-xs btn-accent ml-auto font-semibold'>edit</Link>
    }

    function GMJoinRequestButton() {
        return (
            <button onClick={showModalOnClick} className='btn btn-xs btn-accent ml-auto font-semibold'>Join Requests
                <div className="badge badge-sm badge-neutral">{game.joinRequests.length}</div>
            </button>)
    }

    return (
        <div className={`flex gap-2 ml-auto`}>
            {(!game.started && type === `gm`) && <GMJoinRequestButton/>}

            {type === `gm` && <GMEditButton/>}
            {game.started && <PlayButton/>}
            {(!game.started && type === `gm`) && <GMStartButton/>}
        </div>
    )
}