// Choices offered on the character creation page. Names and numbers only (no rules text).
import type {Ability, Dnd5eSkill, Pf2eSkill} from "@/lib/assets/classes/characterSheet";

export const ABILITIES: { key: Ability, label: string, short: string }[] = [
    {key: `strength`, label: `Strength`, short: `STR`},
    {key: `dexterity`, label: `Dexterity`, short: `DEX`},
    {key: `constitution`, label: `Constitution`, short: `CON`},
    {key: `intelligence`, label: `Intelligence`, short: `INT`},
    {key: `wisdom`, label: `Wisdom`, short: `WIS`},
    {key: `charisma`, label: `Charisma`, short: `CHA`},
];

export const ABILITY_SHORT = Object.fromEntries(ABILITIES.map((a) => [a.key, a.short])) as Record<Ability, string>;

// ---------- D&D 5e (2014 sheet) ----------

export type Dnd5eClassOption = { name: string, hitDie: 6 | 8 | 10 | 12, saves: [Ability, Ability] };

export const DND5E_CLASSES: Dnd5eClassOption[] = [
    {name: `Barbarian`, hitDie: 12, saves: [`strength`, `constitution`]},
    {name: `Bard`, hitDie: 8, saves: [`dexterity`, `charisma`]},
    {name: `Cleric`, hitDie: 8, saves: [`wisdom`, `charisma`]},
    {name: `Druid`, hitDie: 8, saves: [`intelligence`, `wisdom`]},
    {name: `Fighter`, hitDie: 10, saves: [`strength`, `constitution`]},
    {name: `Monk`, hitDie: 8, saves: [`strength`, `dexterity`]},
    {name: `Paladin`, hitDie: 10, saves: [`wisdom`, `charisma`]},
    {name: `Ranger`, hitDie: 10, saves: [`strength`, `dexterity`]},
    {name: `Rogue`, hitDie: 8, saves: [`dexterity`, `intelligence`]},
    {name: `Sorcerer`, hitDie: 6, saves: [`constitution`, `charisma`]},
    {name: `Warlock`, hitDie: 8, saves: [`wisdom`, `charisma`]},
    {name: `Wizard`, hitDie: 6, saves: [`intelligence`, `wisdom`]},
];

export const DND5E_ALIGNMENTS = [
    `Lawful good`, `Neutral good`, `Chaotic good`,
    `Lawful neutral`, `True neutral`, `Chaotic neutral`,
    `Lawful evil`, `Neutral evil`, `Chaotic evil`, `Unaligned`,
];

export const DND5E_STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export const DND5E_SKILL_LABELS: Record<Dnd5eSkill, string> = {
    acrobatics: `Acrobatics`, animalHandling: `Animal Handling`, arcana: `Arcana`, athletics: `Athletics`,
    deception: `Deception`, history: `History`, insight: `Insight`, intimidation: `Intimidation`,
    investigation: `Investigation`, medicine: `Medicine`, nature: `Nature`, perception: `Perception`,
    performance: `Performance`, persuasion: `Persuasion`, religion: `Religion`,
    sleightOfHand: `Sleight of Hand`, stealth: `Stealth`, survival: `Survival`,
};

// ---------- Pathfinder 2e (Remaster) ----------

export type Pf2eClassOption = { name: string, hp: number, keyAttributes: Ability[] };

// Player Core and Player Core 2 classes
export const PF2E_CLASSES: Pf2eClassOption[] = [
    {name: `Alchemist`, hp: 8, keyAttributes: [`intelligence`]},
    {name: `Barbarian`, hp: 12, keyAttributes: [`strength`]},
    {name: `Bard`, hp: 8, keyAttributes: [`charisma`]},
    {name: `Champion`, hp: 10, keyAttributes: [`strength`, `dexterity`]},
    {name: `Cleric`, hp: 8, keyAttributes: [`wisdom`]},
    {name: `Druid`, hp: 8, keyAttributes: [`wisdom`]},
    {name: `Fighter`, hp: 10, keyAttributes: [`strength`, `dexterity`]},
    {name: `Investigator`, hp: 8, keyAttributes: [`intelligence`]},
    {name: `Monk`, hp: 10, keyAttributes: [`strength`, `dexterity`]},
    {name: `Oracle`, hp: 8, keyAttributes: [`charisma`]},
    {name: `Ranger`, hp: 10, keyAttributes: [`strength`, `dexterity`]},
    {name: `Rogue`, hp: 8, keyAttributes: [`dexterity`, `strength`, `intelligence`, `charisma`]},
    {name: `Sorcerer`, hp: 6, keyAttributes: [`charisma`]},
    {name: `Swashbuckler`, hp: 10, keyAttributes: [`dexterity`]},
    {name: `Witch`, hp: 6, keyAttributes: [`intelligence`]},
    {name: `Wizard`, hp: 6, keyAttributes: [`intelligence`]},
];

export const PF2E_SKILL_LABELS: Record<Pf2eSkill, string> = {
    acrobatics: `Acrobatics`, arcana: `Arcana`, athletics: `Athletics`, crafting: `Crafting`,
    deception: `Deception`, diplomacy: `Diplomacy`, intimidation: `Intimidation`, medicine: `Medicine`,
    nature: `Nature`, occultism: `Occultism`, performance: `Performance`, religion: `Religion`,
    society: `Society`, stealth: `Stealth`, survival: `Survival`, thievery: `Thievery`,
};

export const PF2E_PROFICIENCIES = [`untrained`, `trained`, `expert`, `master`, `legendary`] as const;

export const SIZES = [`Tiny`, `Small`, `Medium`, `Large`];
