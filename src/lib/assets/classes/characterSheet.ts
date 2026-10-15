/**
 * Character-sheet data, not a rules engine or a PDF form-field adapter.
 * Sources:
 * https://media.wizards.com/2016/dnd/downloads/5E_CharacterSheet_Fillable.pdf
 * https://downloads.paizo.com/RemasterPlayerCoreCharacterSheet.pdf
 *
 * D&D uses the linked 2014-style sheet; PF2e uses the Remaster sheet.
 * All numbers are stored values unless explicitly calculated by a helper.
 * TypeScript types do not validate untrusted JSON at runtime.
 */

export type GameSystem = 'dnd5e' | 'pf2e';
export type Ability = 'strength' | 'dexterity' | 'constitution'
  | 'intelligence' | 'wisdom' | 'charisma';
export type SixAbilities<T> = Record<Ability, T>;
export type SpellLevel5e = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type SpellRankPf2e = SpellLevel5e | 10;
export type SlotLevel5e = Exclude<SpellLevel5e, 0>;
export type SlotRankPf2e = Exclude<SpellRankPf2e, 0>;

/** Final displayed value plus optional explanatory components. */
export interface Statistic {
  total: number;
  components?: { label: string; value: number; source?: string }[];
  notes?: string;
}
export interface Pool { current: number; maximum: number }
export interface HitPoints extends Pool { temporary: number }
export interface Movement {
  speed: number;
  unit: 'ft' | 'm';
  other: { mode: string; speed: number; notes?: string }[];
}
export interface Condition {
  name: string;
  value?: number;
  duration?: string;
  source?: string;
  notes?: string;
}
export interface Feature {
  id: string;
  name: string;
  description: string;
  source?: string;
  page?: string;
  levelAcquired?: number;
  traits?: string[];
  uses?: Pool;
  recharge?: string;
}
export interface Damage {
  /** Free-form notation supports multiple dice, modifiers, and special damage. */
  expression: string;
  type: string;
  notes?: string;
}
export interface Biography {
  age?: string;
  height?: string;
  weight?: string;
  eyes?: string;
  skin?: string;
  hair?: string;
  ethnicity?: string;
  nationality?: string;
  birthplace?: string;
  genderAndPronouns?: string;
  appearance: string;
  portraitUrl?: string;
  backstory: string;
  personality: string;
  deityOrPhilosophy?: string;
  allies: string[];
  enemies: string[];
  organizations: { name: string; notes?: string; symbolUrl?: string }[];
  campaignNotes: string;
}
export interface Item {
  id: string;
  name: string;
  quantity: number;
  description?: string;
  containerId?: string;
  /** A structured value avoids assuming that all prices are gold pieces. */
  price?: { amount: number; denomination: string };
}
export interface SharedCharacter {
  schemaVersion: 1;
  id: string;
  name: string;
  playerName: string;
  background: string;
  experiencePoints: number;
  size: string;
  languages: string[];
  hitPoints: HitPoints;
  movement: Movement;
  conditions: Condition[];
  biography: Biography;
  notes: string;
  /** Application-specific metadata; not a substitute for typed sheet fields. */
  extensions?: Record<string, unknown>;
}

export const DND5E_SKILL_ABILITIES = {
  acrobatics: 'dexterity', animalHandling: 'wisdom', arcana: 'intelligence',
  athletics: 'strength', deception: 'charisma', history: 'intelligence',
  insight: 'wisdom', intimidation: 'charisma', investigation: 'intelligence',
  medicine: 'wisdom', nature: 'intelligence', perception: 'wisdom',
  performance: 'charisma', persuasion: 'charisma', religion: 'intelligence',
  sleightOfHand: 'dexterity', stealth: 'dexterity', survival: 'wisdom',
} as const satisfies Record<string, Ability>;
export type Dnd5eSkill = keyof typeof DND5E_SKILL_ABILITIES;
export type Dnd5eTraining = 'none' | 'half' | 'proficient' | 'expertise';
export interface Dnd5eCheck extends Statistic {
  ability: Ability;
  training: Dnd5eTraining;
}
export interface Dnd5eItem extends Item {
  weight?: { perItem: number; unit: 'lb' | 'kg' };
  equipped?: boolean;
  attuned?: boolean;
}
export interface Dnd5eAttack {
  id: string;
  name: string;
  attackBonus: Statistic;
  damage: Damage[];
  range?: string;
  properties: string[];
  notes?: string;
}
export interface Dnd5eSpell {
  id: string;
  name: string;
  level: SpellLevel5e;
  prepared: boolean;
  source?: string;
  castingTime?: string;
  range?: string;
  components?: string;
  duration?: string;
  concentration?: boolean;
  ritual?: boolean;
  description?: string;
}
export interface Dnd5eCasting {
  id: string;
  /** Separate entries accommodate multiclassing and other spell sources. */
  source: string;
  ability: Ability;
  saveDC: Statistic;
  attackBonus: Statistic;
  spells: Dnd5eSpell[];
}
export interface Dnd5eCharacter extends SharedCharacter {
  system: 'dnd5e';
  ruleset: '2014';
  race: string;
  alignment: string;
  classes: { name: string; level: number; subclass?: string }[];
  abilities: SixAbilities<{ score: number; modifier: number }>;
  proficiencyBonus: number;
  inspiration: boolean;
  savingThrows: SixAbilities<Dnd5eCheck>;
  skills: Record<Dnd5eSkill, Dnd5eCheck>;
  passivePerception: Statistic;
  armorClass: Statistic;
  initiative: Statistic;
  hitDice: { die: string; total: number; remaining: number; className?: string }[];
  deathSaves: { successes: number; failures: number };
  attacks: Dnd5eAttack[];
  attackAndSpellcastingNotes: string;
  otherProficiencies: string[];
  featuresAndTraits: Feature[];
  additionalFeaturesAndTraits: Feature[];
  personalityTraits: string;
  ideals: string;
  bonds: string;
  flaws: string;
  inventory: Dnd5eItem[];
  currency: Record<'cp' | 'sp' | 'ep' | 'gp' | 'pp', number>;
  treasure: string;
  spellcasting: Dnd5eCasting[];
  /** Shared slots live outside class entries to avoid multiclass duplication. */
  spellSlots: Partial<Record<SlotLevel5e, { total: number; expended: number }>>;
  /** Separate pools support Pact Magic or other separately restored slots. */
  specialSlotPools: {
    id: string; source: string; level: SlotLevel5e;
    total: number; expended: number; recharge: string;
  }[];
}

export type Pf2eProficiency = 'untrained' | 'trained' | 'expert' | 'master' | 'legendary';
export interface Pf2eStatistic extends Statistic {
  ability?: Ability;
  proficiency: Pf2eProficiency;
}
export const PF2E_SKILL_ABILITIES = {
  acrobatics: 'dexterity', arcana: 'intelligence', athletics: 'strength',
  crafting: 'intelligence', deception: 'charisma', diplomacy: 'charisma',
  intimidation: 'charisma', medicine: 'wisdom', nature: 'wisdom',
  occultism: 'intelligence', performance: 'charisma', religion: 'wisdom',
  society: 'intelligence', stealth: 'dexterity', survival: 'wisdom',
  thievery: 'dexterity',
} as const satisfies Record<string, Ability>;
export type Pf2eSkill = keyof typeof PF2E_SKILL_ABILITIES;
export type Pf2eActionCost = 1 | 2 | 3 | 'free' | 'reaction' | 'varies';
export type Pf2eTradition = 'arcane' | 'divine' | 'occult' | 'primal';
export interface Pf2eAction extends Feature {
  cost: Pf2eActionCost;
  trigger?: string;
  requirements?: string;
  frequency?: string;
}
export interface Pf2eStrike {
  id: string;
  name: string;
  kind: 'melee' | 'ranged';
  attack: Pf2eStatistic;
  damage: Damage[];
  traits: string[];
  range?: string;
  notes?: string;
}
export interface Pf2eItem extends Item {
  /** Per-item Bulk. Light and negligible Bulk remain distinct. */
  bulk: number | 'L' | '-';
  usage: 'held' | 'worn' | 'stowed' | 'other';
  consumable: boolean;
  invested: boolean;
  treasure?: boolean;
}
export interface Pf2eSpell {
  id: string;
  name: string;
  /** Actual casting rank; a cantrip's rank is not zero in PF2e. */
  rank: SlotRankPf2e;
  baseRank?: SpellRankPf2e;
  kind: 'cantrip' | 'spell' | 'focus' | 'innate' | 'ritual';
  actions?: Pf2eActionCost;
  castingTime?: string;
  traits?: string[];
  description?: string;
  frequency?: string;
  ritualCost?: string;
  uses?: Pool;
}
export interface Pf2eCasting {
  id: string;
  source: string;
  tradition: Pf2eTradition;
  mode: 'prepared' | 'spontaneous' | 'innate' | 'focus';
  ability: Ability;
  attack: Pf2eStatistic;
  dc: Pf2eStatistic;
  cantripsPerDay?: number;
  cantripRank?: SlotRankPf2e;
  focusSpellRank?: SlotRankPf2e;
  spells: Pf2eSpell[];
  slots: Partial<Record<SlotRankPf2e, { perDay: number; remaining: number }>>;
  /** Repeated spellId entries permit preparing a spell more than once. */
  preparations: { spellId: string; rank: SlotRankPf2e; expended: boolean }[];
  preparedCantripIds: string[];
  signatureSpellIds: string[];
}
export interface Pf2eCharacter extends SharedCharacter {
  system: 'pf2e';
  ruleset: 'remaster';
  level: number;
  ancestry: string;
  heritage: string;
  traits: string[];
  ancestryNotes: string;
  backgroundNotes: string;
  class: { name: string; keyAttribute: Ability; notes: string };
  attributes: SixAbilities<{ modifier: number; partialBoost: boolean }>;
  heroPoints: number;
  perception: Pf2eStatistic;
  senses: string[];
  armorClass: Pf2eStatistic & { dexterityCap?: number; shieldBonus: number };
  shield?: { name: string; hardness: number; hitPoints: Pool; brokenThreshold: number };
  savingThrows: Record<'fortitude' | 'reflex' | 'will', Pf2eStatistic>;
  classDC: Pf2eStatistic;
  defenseNotes: string;
  classDCReminders: string;
  dying: number;
  wounded: number;
  resistances: { type: string; value: number; exceptions?: string }[];
  immunities: string[];
  weaknesses: { type: string; value: number; exceptions?: string }[];
  armorProficiencies: Record<'unarmored' | 'light' | 'medium' | 'heavy', Pf2eProficiency>;
  weaponProficiencies: {
    category: string; proficiency: Pf2eProficiency; criticalSpecialization?: string;
  }[];
  skills: Record<Pf2eSkill, Pf2eStatistic>;
  loreSkills: { id: string; subject: string; statistic: Pf2eStatistic }[];
  skillNotes: string;
  strikes: Pf2eStrike[];
  featsAndFeatures: (Feature & {
    category: 'ancestry' | 'heritage' | 'background' | 'classFeat'
      | 'classFeature' | 'skill' | 'general' | 'archetype' | 'other';
  })[];
  attributeBoosts: { level: number; attributes: Ability[]; notes?: string }[];
  actions: Pf2eAction[];
  inventory: Pf2eItem[];
  currency: Record<'cp' | 'sp' | 'gp' | 'pp', number>;
  bulk: { total: number; lightItems: number; encumberedAt: number; maximum: number };
  investment: { current: number; maximum: number };
  attitude: string;
  likes: string[];
  dislikes: string[];
  catchphrases: string[];
  edicts: string[];
  anathema: string[];
  /** A character-wide pool shared by focus spell sources. */
  focusPoints: Pool;
  spellcasting: Pf2eCasting[];
  rituals: Pf2eSpell[];
}

/** Narrow on data.system to safely access system-specific fields. */
export type CharacterSheet = Dnd5eCharacter | Pf2eCharacter;

const abilities: Ability[] = [
  'strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma',
];
function six<T>(create: (ability: Ability) => T): SixAbilities<T> {
  return Object.fromEntries(abilities.map(a => [a, create(a)])) as SixAbilities<T>;
}
function checks<K extends string, T>(
  map: Record<K, Ability>, create: (ability: Ability) => T,
): Record<K, T> {
  return Object.fromEntries(
    (Object.keys(map) as K[]).map(key => [key, create(map[key])]),
  ) as Record<K, T>;
}
function shared(id: string, name: string): SharedCharacter {
  return {
    schemaVersion: 1, id, name, playerName: '', background: '',
    experiencePoints: 0, size: 'Medium', languages: [],
    hitPoints: { current: 0, maximum: 0, temporary: 0 },
    movement: { speed: 0, unit: 'ft', other: [] }, conditions: [], notes: '',
    biography: {
      appearance: '', backstory: '', personality: '', allies: [], enemies: [],
      organizations: [], campaignNotes: '',
    },
  };
}
const dndCheck = (ability: Ability): Dnd5eCheck => ({ total: 0, ability, training: 'none' });
const pfCheck = (ability?: Ability): Pf2eStatistic => ({
  total: 0, proficiency: 'untrained', ...(ability ? { ability } : {}),
});

export class CharacterData<T extends CharacterSheet = CharacterSheet> {
  /** Mutable, JSON-friendly sheet data. Factories create independent blank sheets. */
  constructor(public readonly data: T) {}

  get system(): T['system'] { return this.data.system; }
  get level(): number {
    const data = this.data;
    return data.system === 'dnd5e'
      ? data.classes.reduce((sum, entry) => sum + entry.level, 0)
      : data.level;
  }

  /** JSON.stringify(character) serializes the sheet, without a data wrapper. */
  toJSON(): T { return this.data; }

  static dnd5e(id: string, name = ''): CharacterData<Dnd5eCharacter> {
    return new CharacterData<Dnd5eCharacter>({
      ...shared(id, name), system: 'dnd5e', ruleset: '2014',
      race: '', alignment: '', classes: [],
      abilities: six(() => ({ score: 10, modifier: 0 })),
      proficiencyBonus: 2, inspiration: false,
      savingThrows: six(dndCheck), skills: checks(DND5E_SKILL_ABILITIES, dndCheck),
      passivePerception: { total: 10 }, armorClass: { total: 10 }, initiative: { total: 0 },
      hitDice: [], deathSaves: { successes: 0, failures: 0 }, attacks: [],
      attackAndSpellcastingNotes: '', otherProficiencies: [], featuresAndTraits: [],
      additionalFeaturesAndTraits: [], personalityTraits: '', ideals: '', bonds: '', flaws: '',
      inventory: [], currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 }, treasure: '',
      spellcasting: [], spellSlots: {}, specialSlotPools: [],
    });
  }

  static pf2e(id: string, name = ''): CharacterData<Pf2eCharacter> {
    return new CharacterData<Pf2eCharacter>({
      ...shared(id, name), system: 'pf2e', ruleset: 'remaster', level: 1,
      ancestry: '', heritage: '', traits: [], ancestryNotes: '', backgroundNotes: '',
      class: { name: '', keyAttribute: 'strength', notes: '' },
      attributes: six(() => ({ modifier: 0, partialBoost: false })),
      heroPoints: 1, perception: pfCheck('wisdom'), senses: [],
      armorClass: { ...pfCheck('dexterity'), total: 10, shieldBonus: 0 },
      savingThrows: { fortitude: pfCheck('constitution'), reflex: pfCheck('dexterity'), will: pfCheck('wisdom') },
      classDC: { ...pfCheck(), total: 10 }, defenseNotes: '', classDCReminders: '',
      dying: 0, wounded: 0, resistances: [], immunities: [], weaknesses: [],
      armorProficiencies: { unarmored: 'untrained', light: 'untrained', medium: 'untrained', heavy: 'untrained' },
      weaponProficiencies: [], skills: checks(PF2E_SKILL_ABILITIES, pfCheck),
      loreSkills: [], skillNotes: '', strikes: [], featsAndFeatures: [], attributeBoosts: [], actions: [],
      inventory: [], currency: { cp: 0, sp: 0, gp: 0, pp: 0 },
      bulk: { total: 0, lightItems: 0, encumberedAt: 5, maximum: 10 },
      investment: { current: 0, maximum: 10 }, attitude: '', likes: [], dislikes: [],
      catchphrases: [], edicts: [], anathema: [], focusPoints: { current: 0, maximum: 0 },
      spellcasting: [], rituals: [],
    });
  }
}

/** Optional base calculations. These never update stored sheet totals. */
export function dnd5eAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}
export function pf2eProficiencyBonus(rank: Pf2eProficiency, level: number): number {
  const bonus = { untrained: 0, trained: 2, expert: 4, master: 6, legendary: 8 }[rank];
  return rank === 'untrained' ? 0 : level + bonus;
}

/* Usage:
const fighter = CharacterData.dnd5e('pc-1', 'Arin');
fighter.data.classes.push({ name: 'Fighter', level: 3 });
fighter.data.abilities.strength = { score: 16, modifier: 3 };

const wizard = CharacterData.pf2e('pc-2', 'Mira');
wizard.data.class = { name: 'Wizard', keyAttribute: 'intelligence', notes: '' };
wizard.data.attributes.intelligence.modifier = 4;
wizard.data.skills.arcana = { total: 7, ability: 'intelligence', proficiency: 'trained' };

function summarize(character: CharacterData): string {
  const sheet = character.data;
  return sheet.system === 'dnd5e'
    ? `${sheet.name}: ${sheet.race}`
    : `${sheet.name}: ${sheet.ancestry} (${sheet.heritage})`;
}

const json = JSON.stringify(wizard);
// Validate parsed JSON with a runtime schema before passing it to the constructor.
*/
