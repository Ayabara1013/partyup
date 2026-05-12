import {useEffect, useState} from "react";
import {supabaseGame} from "@/lib/supabase/db/game";

export default function JoinRequestList({game}: { game: any }) {
    const [reqButtons, setReqButtons] = useState<Array<any>>([]);
    useEffect(() => {
        if (!game?.joinRequests) return;

        const buttons = game.joinRequests.map((request: any, index: number) => {
            const acceptOnClick = async () => {
                let result = await supabaseGame.set.acceptRequest(game.id, request.id);
                if (result)
                    setReqButtons(prev => {
                        const newButtons = [...prev];
                        newButtons.splice(index, 1);
                        return newButtons;
                    });
            };
            return (
                <button
                    key={request.id ?? index}
                    onClick={acceptOnClick}
                    className="btn btn-primary button-breakpoints md:px-6 txt-3xl"
                >
                    {request.name}
                </button>
            );
        });

        setReqButtons(buttons);
    }, [game?.joinRequests]);

    return (
        <div className='__players-list__list flex flex-row flex-wrap gap-2 mt-5'>
            {reqButtons}
        </div>
    )
}