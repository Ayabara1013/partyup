import {MouseEvent} from "react";
import toast from "react-hot-toast";
import {useContextMenuSetter} from "@/app/(context)/contextMenuContext";
import {supabaseInGame} from "@/lib/supabase/db/inGame";
import {GraveCharacter, RosterEntry, supabaseCharacter} from "@/lib/supabase/db/character";

type GMToolsProps = {
    game: any;
    settings: any;
    roster: RosterEntry[];
    graveyard: GraveCharacter[];
};

// Approximate menu width, to open it leftwards near the right edge of the window
const MENU_WIDTH = 200;

export default function GMTools({game, settings, roster, graveyard}: GMToolsProps) {
    const players: any[] = game.players ?? [];
    const setContextMenu = useContextMenuSetter();

    // Left or right click on a player opens the same menu at the pointer (or under the button for keyboard clicks)
    const openPlayerMenu = (e: MouseEvent<HTMLButtonElement>, player: any) => {
        e.preventDefault();
        e.stopPropagation(); // the menu closes on window clicks; don't let this click reach the window

        const rect = e.currentTarget.getBoundingClientRect();
        const fromKeyboard = e.clientX === 0 && e.clientY === 0;
        const x = fromKeyboard ? rect.left : e.clientX;
        const y = fromKeyboard ? rect.bottom : e.clientY;
        const openLeft = x + MENU_WIDTH > window.innerWidth;

        const seat = roster.find((entry) => entry.userId === player.id);
        const character = seat?.character;
        const hasTalkingStick = settings.talkingStick === player.id;
        const close = () => setContextMenu({clicked: false});

        const item = (key: string, label: string, onClick?: () => void, tone = ``) =>
            <li key={key} className={`btn btn-ghost btn-sm ${tone} ${onClick ? `` : `btn-disabled`}`}
                onClick={onClick ? () => { close(); onClick(); } : undefined}>{label}</li>;

        const options = [
            item(`stick`, hasTalkingStick ? `Take back talking stick` : `Give talking stick`,
                () => supabaseInGame.set.talkingStick(game.id, hasTalkingStick ? `` : player.id)),
        ];
        if (seat && !character) {
            options.push(seat.canCreateCharacter
                ? item(`revoke`, `Revoke new character`, () => supabaseCharacter.set.allowNewCharacter(game.id, player.id, false))
                : item(`allow`, `Allow new character`, () => supabaseCharacter.set.allowNewCharacter(game.id, player.id, true)));
        }
        // Only dead characters can go to the grave
        if (character?.dead) {
            options.push(item(`grave`, `Send ${character.name} to grave`, async () => {
                if (await supabaseCharacter.set.sendToGrave(character.id)) toast(`${character.name} was sent to the grave.`);
            }, `text-error`));
        }
        options.push(item(`placeholder-1`, `Placeholder 1`), item(`placeholder-2`, `Placeholder 2`));

        setContextMenu({
            clicked: true,
            options,
            style: {top: `${y}px`, ...(openLeft ? {right: `${window.innerWidth - x}px`} : {left: `${x}px`})},
        });
    };

    return (
        <section className='panel tool-row__element'>
            <header className='panel__bar'>
                <div className='panel__title'>
                    <span className='panel__name'>GM Tools</span>
                    <span className='panel__desc'>Click a player for options</span>
                </div>
            </header>
            <div className='panel__body'>
                {players.length === 0
                    ? <p className='panel__hint'>No players have joined yet.</p>
                    : <div className="gm-players">
                        {players.map((player: any) => {
                            const character = roster.find((entry) => entry.userId === player.id)?.character;
                            const hasTalkingStick = settings.talkingStick === player.id;
                            return (
                                <button key={player.id} aria-haspopup="menu"
                                        className={`btn btn-sm ${hasTalkingStick ? `btn-primary` : `btn-ghost border border-neutral-content/20`}`}
                                        title={hasTalkingStick ? `Has the talking stick` : undefined}
                                        onClick={(e) => openPlayerMenu(e, player)}
                                        onContextMenu={(e) => openPlayerMenu(e, player)}>
                                    {player.name}
                                    {character && <span className="gm-players__character">({character.name}{character.dead ? ` †` : ``})</span>}
                                </button>
                            );
                        })}
                    </div>
                }

                {graveyard.length > 0 &&
                  <details className="gm-grave">
                      <summary>Graveyard ({graveyard.length})</summary>
                      <ul>
                          {graveyard.map((c) =>
                              <li key={c.id}>
                                  <span className="font-semibold">{c.name}</span>
                                  <span className="panel__hint"> · {players.find((p) => p.id === c.ownerUid)?.name ?? `former player`}</span>
                              </li>)}
                      </ul>
                  </details>
                }
            </div>
        </section>
    )
}
