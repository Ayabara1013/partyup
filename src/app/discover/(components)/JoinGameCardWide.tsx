import '@/styles/discover/discover.scss';

import timeSince from '@/lib/util/timeSince';
import Link from 'next/link';

const coolImages = require("cool-images");
// removed m-auto so it fits wide
const focusBoxClass = 'p-2 border-success whitespace-nowrap bg-neutral-focus rounded-xl shadow-xl';

type GameMaster = { name: string;};

type Player = { id?: string | number; name?: string; };

type Game = {
    id: string | number;
    name: string;
    description: string;
    system: string;
    maxPlayers: number;
    createdAt: string;
    players: Player[];
    gm: GameMaster;
    ageRestriction: number;
};

type JoinGameCardWideProps = { game: Game; };

type PropertyListItemProps = { label?: string; value?: string | number; };

type JoinMiddleProps = { game: Game; };

type JoinRightProps = { game: Game; };

export default function JoinGameCardWide({game,}: JoinGameCardWideProps) {
    return (
        <div className="join-card flex bg-neutral m-4 p-4 gap-4 min-h-[16rem]">
            <div className="discover-card-left flex flex-col gap-4 min-w-[224px]">
                <div className="aspect-square border">
                    <img src={coolImages.one(200, 200)} alt="" className="rounded-full h-full shadow-xl"/>
                </div>

                <div className={`gm-details ${focusBoxClass}`}>
                    <div className="text-center text-primary text-lg font-bold">Game Master</div>
                    <ul>
                        <PropertyListItem label="Username" value={game.gm.name}/>
                    </ul>
                </div>
            </div>

            <JoinMiddle game={game}/>

            <JoinRight game={game}/>
        </div>
    );
}

function PropertyListItem({label = 'error', value = 'value error',}: PropertyListItemProps) {
    return (
        <li className="whitespace-nowrap">
            <span className="font-semibold text-secondary">
                {`${label}: `}
            </span>
            <span>{value}</span>
        </li>
    );
}

function JoinMiddle({game,}: JoinMiddleProps) {
    return (
        <div className="flex flex-col flex-fill">
            <div className="join-card__middle flex-col-4 gap-4">
                <div
                    className="discover-card-middle flex flex-col justify-between p-2 border-accent overflow-clip rounded-xl shadow-xl">
                    <div className="text-center text-3xl text-primary font-bold text-shadow-md">
                        {game.name}
                    </div>
                    <div className="text-xl">
                        {game.description}
                    </div>
                    <div className="flex justify-center">
                        <Link href={`/games/info/${game.id}`} className="btn btn-secondary btn-shadow-md">
                            read more
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function JoinRight({game}: JoinRightProps) {
    const pCur = game.players.length; // current players
    const pMax = game.maxPlayers; // max players
    const pRem = pMax - pCur; // remaining players
    const createdAt = new Date(game.createdAt)
    return (
        <div className={`discover-card-right ${focusBoxClass} mb-auto`}>
            <div className="text-primary font-bold">details</div>

            <ul>
                <PropertyListItem label="System" value={game.system}/>

                <PropertyListItem label="Current Players"
                                  value={`${pCur}/${pMax} (${pRem} seat${pRem !== 1 ? 's' : ''} remaining)`}/>

                <PropertyListItem label="Created At:"
                                  value={`${createdAt.toLocaleDateString()} ( ${timeSince(createdAt)} )`}/>

                <PropertyListItem label="Age Restriction" value={game.ageRestriction}/>

                <PropertyListItem label="Current Average Level" value={`10`}/>
            </ul>
            <br/>
            <div className="text-primary font-bold">players</div>
            <ul>
                {game.players.map((player, index) => {
                    return (
                        <li key={index}>
                            <span className="text-secondary font-medium">@{player.name}</span>{' '} as fighter
                        </li>)
                })}
            </ul>
        </div>
    );
}