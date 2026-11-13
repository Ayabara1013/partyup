import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase/client/client";
import {GraveCharacter, RosterEntry, supabaseCharacter} from "@/lib/supabase/db/character";

// One action (creating a character, sending one to the grave) changes a seat and a character: wait this long after
// the first event, so both changes lead to one refetch
const reFetchDelayMs = 150;

// Who has which character in the game, who may create one, and (for the GM's panel) who's in the grave.
// Refetches whenever a seat or a character in the game changes (Realtime), so GM actions show up for everyone.
export function useCharacterRoster(gameId: string | undefined, withGraveyard: boolean) {
    const [roster, setRoster] = useState<RosterEntry[]>([]);
    const [graveyard, setGraveyard] = useState<GraveCharacter[]>([]);

    useEffect(() => {
        if (!gameId) return;
        let latest = 0;                                         // number of the newest refetch; older answers are dropped
        let timer: ReturnType<typeof setTimeout> | null = null; // a refetch waiting for the rest of an action's events

        const load = async () => {
            const request = ++latest;
            const [nextRoster, nextGraveyard] = await Promise.all([
                supabaseCharacter.get.roster(gameId),
                withGraveyard ? supabaseCharacter.get.graveyard(gameId) : Promise.resolve<GraveCharacter[]>([]),
            ]);
            if (request !== latest) return; // a newer refetch has started, or the effect was cleaned up
            setRoster(nextRoster);
            setGraveyard(nextGraveyard);
        };

        // Realtime events: one refetch shortly after the first; events in between are covered by it
        const scheduleLoad = () => {
            if (timer) return;
            timer = setTimeout(() => {
                timer = null;
                load();
            }, reFetchDelayMs);
        };

        load(); // the first load stays immediate
        const channel = supabaseCharacter.live.roster(gameId, scheduleLoad);
        return () => {
            latest++; // drops any answer still on its way
            if (timer) clearTimeout(timer);
            supabase.removeChannel(channel);
        };
    }, [gameId, withGraveyard]);

    return {roster, graveyard};
}
