import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase/client/client";
import {GraveCharacter, RosterEntry, supabaseCharacter} from "@/lib/supabase/db/character";

// Who has which character in the game, who may create one, and who's in the grave.
// Refetches whenever a seat or a character in the game changes (Realtime), so GM actions show up for everyone.
export function useCharacterRoster(gameId: string | undefined) {
    const [roster, setRoster] = useState<RosterEntry[]>([]);
    const [graveyard, setGraveyard] = useState<GraveCharacter[]>([]);

    useEffect(() => {
        if (!gameId) return;
        let cancelled = false;

        const load = () => Promise.all([
            supabaseCharacter.get.roster(gameId),
            supabaseCharacter.get.graveyard(gameId),
        ]).then(([nextRoster, nextGraveyard]) => {
            if (cancelled) return;
            setRoster(nextRoster);
            setGraveyard(nextGraveyard);
        });

        load();
        const channel = supabaseCharacter.live.roster(gameId, load);
        return () => {
            cancelled = true;
            supabase.removeChannel(channel);
        };
    }, [gameId]);

    return {roster, graveyard};
}
