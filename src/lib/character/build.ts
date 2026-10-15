// Turns the character creation form's input into a full character sheet (characterSheet.ts).
// Pure functions: the same draft always gives the same sheet, and they're safe to call on every render.
import {
    Ability, CharacterData, dnd5eAbilityModifier, Dnd5eCharacter, Dnd5eSkill, Dnd5eTraining,
    DND5E_SKILL_ABILITIES, pf2eProficiencyBonus, Pf2eCharacter, Pf2eProficiency, Pf2eSkill,
    PF2E_SKILL_ABILITIES, SixAbilities,
} from "@/lib/assets/classes/characterSheet";
import {DND5E_CLASSES, PF2E_CLASSES} from "@/lib/character/options";

// ---------- Shared ----------

export type SharedDraft = {
    name: string;
    background: string;
    languages: string; // comma separated in the form
    size: string;
    speed: number;
    appearance: string;
    backstory: string;
};

const splitList = (text: string) => [...new Set(text.split(`,`).map((s) => s.trim()).filter(Boolean))];
const clampLevel = (level: number) => Math.min(20, Math.max(1, Math.trunc(level) || 1));

function applyShared(sheet: Dnd5eCharacter | Pf2eCharacter, draft: SharedDraft, playerName: string) {
    sheet.name = draft.name.trim();
    sheet.playerName = playerName;
    sheet.background = draft.background.trim();
    sheet.languages = splitList(draft.languages);
    sheet.size = draft.size;
    sheet.movement.speed = draft.speed;
    sheet.biography.appearance = draft.appearance.trim();
    sheet.biography.backstory = draft.backstory.trim();
}

// ---------- D&D 5e ----------

export type Dnd5eDraft = SharedDraft & {
    race: string;
    className: string;
    subclass: string;
    level: number;
    alignment: string;
    scores: SixAbilities<number>;
    skills: Record<Dnd5eSkill, Dnd5eTraining>;
    armorClass: number | null; // null = unarmored (10 + DEX)
    personalityTraits: string;
    ideals: string;
    bonds: string;
    flaws: string;
};

export const dnd5eProficiencyBonus = (level: number) => 2 + Math.floor((clampLevel(level) - 1) / 4);

const dndTrainingBonus = (training: Dnd5eTraining, prof: number) =>
    training === `expertise` ? prof * 2 : training === `proficient` ? prof : training === `half` ? Math.floor(prof / 2) : 0;

// Level 1 takes the hit die's maximum; later levels take the fixed average (die / 2 + 1). Each level gives at least 1 HP.
export function dnd5eHitPoints(hitDie: number, level: number, conMod: number) {
    const later = Math.max(1, hitDie / 2 + 1 + conMod) * (clampLevel(level) - 1);
    return Math.max(1, hitDie + conMod) + later;
}

export function dnd5eSummary(draft: Dnd5eDraft) {
    const level = clampLevel(draft.level);
    const option = DND5E_CLASSES.find((c) => c.name === draft.className);
    const mods = Object.fromEntries(Object.entries(draft.scores).map(([a, s]) => [a, dnd5eAbilityModifier(s)])) as SixAbilities<number>;
    const prof = dnd5eProficiencyBonus(level);
    const perception = mods.wisdom + dndTrainingBonus(draft.skills.perception, prof);
    return {
        level,
        mods,
        prof,
        hitDie: option?.hitDie ?? null,
        hitPoints: option ? dnd5eHitPoints(option.hitDie, level, mods.constitution) : null,
        armorClass: draft.armorClass ?? 10 + mods.dexterity,
        initiative: mods.dexterity,
        passivePerception: 10 + perception,
        saves: Object.fromEntries(Object.entries(mods).map(([a, m]) =>
            [a, m + (option?.saves.includes(a as Ability) ? prof : 0)])) as SixAbilities<number>,
        skill: (skill: Dnd5eSkill) => mods[DND5E_SKILL_ABILITIES[skill]] + dndTrainingBonus(draft.skills[skill], prof),
    };
}

export function buildDnd5eSheet(draft: Dnd5eDraft, id: string, playerName: string): Dnd5eCharacter {
    const sheet = CharacterData.dnd5e(id).data;
    const summary = dnd5eSummary(draft);
    const option = DND5E_CLASSES.find((c) => c.name === draft.className);
    applyShared(sheet, draft, playerName);

    sheet.race = draft.race.trim();
    sheet.alignment = draft.alignment;
    sheet.classes = draft.className
        ? [{name: draft.className, level: summary.level, ...(draft.subclass.trim() ? {subclass: draft.subclass.trim()} : {})}]
        : [];
    sheet.proficiencyBonus = summary.prof;

    for (const ability of Object.keys(sheet.abilities) as Ability[]) {
        sheet.abilities[ability] = {score: draft.scores[ability], modifier: summary.mods[ability]};
        const proficient = !!option?.saves.includes(ability);
        sheet.savingThrows[ability] = {ability, training: proficient ? `proficient` : `none`, total: summary.saves[ability]};
    }
    for (const skill of Object.keys(sheet.skills) as Dnd5eSkill[]) {
        sheet.skills[skill] = {ability: DND5E_SKILL_ABILITIES[skill], training: draft.skills[skill], total: summary.skill(skill)};
    }

    sheet.armorClass = {total: summary.armorClass, ...(draft.armorClass === null ? {notes: `Unarmored (10 + DEX)`} : {})};
    sheet.initiative = {total: summary.initiative};
    sheet.passivePerception = {total: summary.passivePerception};
    if (summary.hitPoints !== null && option) {
        sheet.hitPoints = {current: summary.hitPoints, maximum: summary.hitPoints, temporary: 0};
        sheet.hitDice = [{die: `d${option.hitDie}`, total: summary.level, remaining: summary.level, className: option.name}];
    }
    sheet.personalityTraits = draft.personalityTraits.trim();
    sheet.ideals = draft.ideals.trim();
    sheet.bonds = draft.bonds.trim();
    sheet.flaws = draft.flaws.trim();
    return sheet;
}

// ---------- Pathfinder 2e ----------

export type Pf2eDraft = SharedDraft & {
    ancestry: string;
    heritage: string;
    ancestryHp: number;
    className: string;
    keyAttribute: Ability;
    level: number;
    attributes: SixAbilities<number>; // modifiers, e.g. +4
    perception: Pf2eProficiency;
    saves: Record<`fortitude` | `reflex` | `will`, Pf2eProficiency>;
    skills: Record<Pf2eSkill, Pf2eProficiency>;
    armorProficiency: Pf2eProficiency;
    armorItemBonus: number;
    dexterityCap: number | null; // null = no cap (unarmored)
};

const SAVE_ATTRIBUTES = {fortitude: `constitution`, reflex: `dexterity`, will: `wisdom`} as const;

export function pf2eSummary(draft: Pf2eDraft) {
    const level = clampLevel(draft.level);
    const option = PF2E_CLASSES.find((c) => c.name === draft.className);
    const a = draft.attributes;
    const bonus = (rank: Pf2eProficiency) => pf2eProficiencyBonus(rank, level);
    const dex = draft.dexterityCap === null ? a.dexterity : Math.min(a.dexterity, draft.dexterityCap);
    return {
        level,
        classHp: option?.hp ?? null,
        hitPoints: option ? draft.ancestryHp + (option.hp + a.constitution) * level : null,
        perception: a.wisdom + bonus(draft.perception),
        armorClass: 10 + dex + draft.armorItemBonus + bonus(draft.armorProficiency),
        classDC: 10 + a[draft.keyAttribute] + bonus(`trained`),
        saves: {
            fortitude: a.constitution + bonus(draft.saves.fortitude),
            reflex: a.dexterity + bonus(draft.saves.reflex),
            will: a.wisdom + bonus(draft.saves.will),
        },
        skill: (skill: Pf2eSkill) => a[PF2E_SKILL_ABILITIES[skill]] + bonus(draft.skills[skill]),
    };
}

export function buildPf2eSheet(draft: Pf2eDraft, id: string, playerName: string): Pf2eCharacter {
    const sheet = CharacterData.pf2e(id).data;
    const summary = pf2eSummary(draft);
    applyShared(sheet, draft, playerName);

    sheet.level = summary.level;
    sheet.ancestry = draft.ancestry.trim();
    sheet.heritage = draft.heritage.trim();
    sheet.class = {name: draft.className, keyAttribute: draft.keyAttribute, notes: ``};
    for (const ability of Object.keys(sheet.attributes) as Ability[]) {
        sheet.attributes[ability] = {modifier: draft.attributes[ability], partialBoost: false};
    }

    sheet.perception = {ability: `wisdom`, proficiency: draft.perception, total: summary.perception};
    for (const save of Object.keys(SAVE_ATTRIBUTES) as (keyof typeof SAVE_ATTRIBUTES)[]) {
        sheet.savingThrows[save] = {ability: SAVE_ATTRIBUTES[save], proficiency: draft.saves[save], total: summary.saves[save]};
    }
    for (const skill of Object.keys(sheet.skills) as Pf2eSkill[]) {
        sheet.skills[skill] = {ability: PF2E_SKILL_ABILITIES[skill], proficiency: draft.skills[skill], total: summary.skill(skill)};
    }
    sheet.armorClass = {
        ability: `dexterity`, proficiency: draft.armorProficiency, total: summary.armorClass, shieldBonus: 0,
        ...(draft.dexterityCap === null ? {} : {dexterityCap: draft.dexterityCap}),
    };
    sheet.classDC = {ability: draft.keyAttribute, proficiency: `trained`, total: summary.classDC};
    if (summary.hitPoints !== null) sheet.hitPoints = {current: summary.hitPoints, maximum: summary.hitPoints, temporary: 0};
    return sheet;
}

// ---------- Display & validation ----------

// 3 -> "+3", -1 -> "-1", 0 -> "+0"
export const signed = (n: number) => `${n >= 0 ? `+` : ``}${n}`;

export type DraftErrors = Partial<Record<`name` | `className` | `lineage` | `abilities` | `armorClass` | `speed` | `ancestryHp` | `armor`, string>>;

const isInt = (n: unknown, min: number, max: number) => Number.isInteger(n) && (n as number) >= min && (n as number) <= max;

export function validateDraft(system: `dnd5e` | `pf2e`, draft: Dnd5eDraft | Pf2eDraft): DraftErrors {
    const errors: DraftErrors = {};
    if (!draft.name.trim()) errors.name = `Give your character a name.`;
    if (!draft.className) errors.className = `Choose a class.`;
    if (!isInt(draft.speed, 0, 200)) errors.speed = `A whole number from 0 to 200.`;

    if (system === `dnd5e`) {
        const d = draft as Dnd5eDraft;
        if (!d.race.trim()) errors.lineage = `Enter a race.`;
        if (!Object.values(d.scores).every((s) => isInt(s, 1, 30))) errors.abilities = `Each score must be a whole number from 1 to 30.`;
        if (d.armorClass !== null && !isInt(d.armorClass, 1, 40)) errors.armorClass = `A whole number from 1 to 40, or blank.`;
    } else {
        const d = draft as Pf2eDraft;
        if (!d.ancestry.trim()) errors.lineage = `Enter an ancestry.`;
        if (!isInt(d.ancestryHp, 0, 20)) errors.ancestryHp = `A whole number from 0 to 20.`;
    }
    return errors;
}
