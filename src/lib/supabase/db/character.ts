import toast from "react-hot-toast";
import {supabase} from "@/lib/supabase/client/client";
import type {CharacterSheet} from "@/lib/assets/classes/characterSheet";

// Characters live in "gameCharacter" (whole sheet in `data`). Rules are enforced by database functions:
// one living character per player per game, creating needs game_player.can_create_character,
// and only the GM can send a character to the grave (game.graveyard) or allow a new one.

export type RosterCharacter = { id: string, name: string, system: string };

// What the player card shows; read straight out of the stored sheet (no full sheet download)
export type CharacterSummary = RosterCharacter & {
    lineage: string;      // D&D race / PF2e ancestry (+ heritage)
    className: string;    // "Wizard", or "Fighter 3 / Wizard 2" for a D&D multiclass
    level: number;
    hitPoints: { current: number, maximum: number, temporary: number } | null;
    dead: boolean;        // only dead characters can be sent to the grave
};

// Dead by the sheet: D&D 5e at 3 failed death saves, Pathfinder 2e at Dying 4.
// (The database function send_character_to_grave applies the same rule.)
export const DND5E_DEATH_FAILURES = 3;
export const PF2E_DEAD_AT_DYING = 4;

export type RosterEntry = {
    userId: string;
    canCreateCharacter: boolean;
    character: CharacterSummary | null; // the player's living character
};

export type GraveCharacter = RosterCharacter & { ownerUid: string, archivedAt: string };

// Normalizes the D&D / PF2e sheet fields picked by the roster query into one shape
export function summarizeCharacter(c: any): CharacterSummary {
    const dndClasses: { name: string, level: number }[] = Array.isArray(c.classes) ? c.classes : [];
    const isDnd = c.system === `dnd5e`;
    return {
        id: c.id,
        name: c.name,
        system: c.system,
        lineage: isDnd ? (c.race ?? ``) : [c.ancestry, c.heritage].filter(Boolean).join(` · `),
        // Single class: just the name (level is shown separately); multiclass: each class with its levels
        className: isDnd
            ? dndClasses.length > 1 ? dndClasses.map((k) => `${k.name} ${k.level}`).join(` / `) : (dndClasses[0]?.name ?? ``)
            : (c.pfClass ?? ``),
        level: isDnd ? dndClasses.reduce((sum, k) => sum + (Number(k.level) || 0), 0) : Number(c.level) || 0,
        hitPoints: c.hitPoints && typeof c.hitPoints === `object` ? c.hitPoints : null,
        dead: isDnd
            ? (Number(c.deathSaves?.failures) || 0) >= DND5E_DEATH_FAILURES
            : (Number(c.dying) || 0) >= PF2E_DEAD_AT_DYING,
    };
}

const supabaseCharacter = {
    get: {
        // Every player's seat in the game: their living character and whether they may create one
        roster: async (gameId: string): Promise<RosterEntry[]> => {
            const {data, error} = await supabase.from(`game_player`)
                .select(`user_id, can_create_character, character:character_id (
                    id, name, system,
                    race:data->>race, ancestry:data->>ancestry, heritage:data->>heritage,
                    level:data->level, classes:data->classes, pfClass:data->class->>name,
                    hitPoints:data->hitPoints, deathSaves:data->deathSaves, dying:data->dying)`)
                .eq(`game_id`, gameId);
            if (error) {
                console.error(error);
                return [];
            }
            return (data ?? []).map((row: any) => ({
                userId: row.user_id,
                canCreateCharacter: row.can_create_character,
                character: row.character ? summarizeCharacter(row.character) : null,
            }));
        },

        // Characters the GM sent to the grave, most recent first
        graveyard: async (gameId: string): Promise<GraveCharacter[]> => {
            const {data, error} = await supabase.from(`gameCharacter`)
                .select(`id, name, system, owner_uid, archived_at`)
                .eq(`game_id`, gameId).eq(`archived`, true)
                .order(`archived_at`, {ascending: false});
            if (error) {
                console.error(error);
                return [];
            }
            return (data ?? []).map((c: any) => ({id: c.id, name: c.name, system: c.system, ownerUid: c.owner_uid, archivedAt: c.archived_at}));
        },
    },

    live: {
        // Calls onChange whenever a seat or a character in this game changes (refetch on change)
        roster: (gameId: string, onChange: () => void) => supabase
            .channel(`roster-${gameId}-${crypto.randomUUID()}`)
            .on(`postgres_changes`, {event: `*`, schema: `public`, table: `game_player`, filter: `game_id=eq.${gameId}`}, onChange)
            .on(`postgres_changes`, {event: `*`, schema: `public`, table: `gameCharacter`, filter: `game_id=eq.${gameId}`}, onChange)
            .subscribe(),
    },

    set: {
        // Saves the sheet as the player's character (database checks the player is allowed)
        create: async (gameId: string, sheet: CharacterSheet) => {
            const {data, error} = await supabase.rpc(`create_character`, {
                p_game_id: gameId, p_id: sheet.id, p_name: sheet.name, p_system: sheet.system, p_data: sheet,
            });
            if (error) {
                console.error(error);
                toast.error(error.code === `23505` ? `You already have a character in this game.` : error.message || `Could not save the character.`);
                return null;
            }
            return data as string;
        },

        // GM only: archive the character and add it to the game's graveyard
        sendToGrave: async (characterId: string) => {
            const {error} = await supabase.rpc(`send_character_to_grave`, {p_character_id: characterId});
            if (error) {
                console.error(error);
                toast.error(error.message || `Could not send the character to the grave.`);
                return false;
            }
            return true;
        },

        // GM only: let a player create a new character (or take that back)
        allowNewCharacter: async (gameId: string, userId: string, allowed = true) => {
            const {error} = await supabase.rpc(`allow_new_character`, {p_game_id: gameId, p_user_id: userId, p_allowed: allowed});
            if (error) {
                console.error(error);
                toast.error(error.message || `Could not update the player.`);
                return false;
            }
            return true;
        },
    },
};

export {supabaseCharacter};
