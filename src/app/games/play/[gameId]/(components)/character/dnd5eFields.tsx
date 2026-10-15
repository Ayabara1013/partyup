import Field from "@/components/ui/field";
import type {Dnd5eSkill, Dnd5eTraining} from "@/lib/assets/classes/characterSheet";
import {DND5E_SKILL_ABILITIES} from "@/lib/assets/classes/characterSheet";
import {ABILITIES, ABILITY_SHORT, DND5E_ALIGNMENTS, DND5E_CLASSES, DND5E_SKILL_LABELS, DND5E_STANDARD_ARRAY} from "@/lib/character/options";
import {Dnd5eDraft, DraftErrors, dnd5eSummary, signed} from "@/lib/character/build";

type Props = {
    draft: Dnd5eDraft;
    set: (patch: Partial<Dnd5eDraft>) => void;
    errors: DraftErrors;
};

const TRAINING_LABELS: Record<Exclude<Dnd5eTraining, `half`>, string> = {none: `—`, proficient: `Proficient`, expertise: `Expertise`};

export default function Dnd5eFields({draft, set, errors}: Props) {
    const summary = dnd5eSummary(draft);
    const classOption = DND5E_CLASSES.find((c) => c.name === draft.className);

    return (
        <>
            <section className="character-form__section">
                <h3 className="character-form__heading">Class &amp; origin</h3>
                <div className="character-form__grid">
                    <Field label="Class" error={errors.className}>
                        <select className="field__input" value={draft.className} onChange={(e) => set({className: e.target.value})}>
                            <option value="" disabled>Choose a class</option>
                            {DND5E_CLASSES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Level">
                        <select className="field__input" value={draft.level} onChange={(e) => set({level: Number(e.target.value)})}>
                            {Array.from({length: 20}, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                        </select>
                    </Field>
                    <Field label="Subclass" optional>
                        <input className="field__input" value={draft.subclass} placeholder="Champion"
                               onChange={(e) => set({subclass: e.target.value})}/>
                    </Field>
                    <Field label="Race" error={errors.lineage}>
                        <input className="field__input" value={draft.race} placeholder="Half-elf"
                               onChange={(e) => set({race: e.target.value})}/>
                    </Field>
                    <Field label="Background" optional>
                        <input className="field__input" value={draft.background} placeholder="Soldier"
                               onChange={(e) => set({background: e.target.value})}/>
                    </Field>
                    <Field label="Alignment" optional>
                        <select className="field__input" value={draft.alignment} onChange={(e) => set({alignment: e.target.value})}>
                            <option value="">—</option>
                            {DND5E_ALIGNMENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </Field>
                </div>
                {classOption &&
                  <p className="panel__hint">
                      {classOption.name}: d{classOption.hitDie} hit die, proficient in {ABILITY_SHORT[classOption.saves[0]]} and {ABILITY_SHORT[classOption.saves[1]]} saving throws.
                  </p>}
            </section>

            <section className="character-form__section">
                <div className="character-form__heading-row">
                    <h3 className="character-form__heading">Ability scores</h3>
                    <div className="flex gap-2">
                        <button type="button" className="btn btn-xs btn-ghost border border-neutral-content/20"
                                onClick={() => set({scores: Object.fromEntries(ABILITIES.map((a, i) => [a.key, DND5E_STANDARD_ARRAY[i]])) as Dnd5eDraft[`scores`]})}>
                            Standard array
                        </button>
                        <button type="button" className="btn btn-xs btn-ghost border border-neutral-content/20"
                                onClick={() => set({scores: Object.fromEntries(ABILITIES.map((a) => [a.key, 10])) as Dnd5eDraft[`scores`]})}>
                            All 10
                        </button>
                    </div>
                </div>
                <div className="ability-grid">
                    {ABILITIES.map(({key, label, short}) =>
                        <label key={key} className="ability-box" title={label}>
                            <span className="ability-box__label">{short}</span>
                            <input className="ability-box__input" type="number" min={1} max={30} inputMode="numeric"
                                   value={Number.isFinite(draft.scores[key]) ? draft.scores[key] : ``}
                                   onChange={(e) => set({scores: {...draft.scores, [key]: e.target.valueAsNumber}})}/>
                            <span className="ability-box__mod">{Number.isFinite(summary.mods[key]) ? signed(summary.mods[key]) : `—`}</span>
                        </label>
                    )}
                </div>
                {errors.abilities && <span className="field__error">{errors.abilities}</span>}
                <p className="panel__hint">Enter final scores, including any racial bonuses.</p>
            </section>

            <section className="character-form__section">
                <h3 className="character-form__heading">Skills</h3>
                <div className="skill-list">
                    {(Object.keys(DND5E_SKILL_LABELS) as Dnd5eSkill[]).map((skill) =>
                        <div key={skill} className={`skill-row ${draft.skills[skill] !== `none` ? `skill-row--trained` : ``}`}>
                            <span className="skill-row__name">
                                {DND5E_SKILL_LABELS[skill]} <span className="skill-row__ability">{ABILITY_SHORT[DND5E_SKILL_ABILITIES[skill]]}</span>
                            </span>
                            <span className="skill-row__total">{Number.isFinite(summary.skill(skill)) ? signed(summary.skill(skill)) : `—`}</span>
                            <select className="skill-row__select" value={draft.skills[skill] === `half` ? `none` : draft.skills[skill]}
                                    onChange={(e) => set({skills: {...draft.skills, [skill]: e.target.value as Dnd5eTraining}})}>
                                {Object.entries(TRAINING_LABELS).map(([value, text]) => <option key={value} value={value}>{text}</option>)}
                            </select>
                        </div>
                    )}
                </div>
            </section>

            <section className="character-form__section">
                <h3 className="character-form__heading">Defenses &amp; movement</h3>
                <div className="character-form__grid">
                    <Field label="Armor class" hint="Leave blank for unarmored (10 + DEX)." error={errors.armorClass}>
                        <input className="field__input" type="number" inputMode="numeric" min={1} max={40}
                               value={draft.armorClass ?? ``} placeholder={String(10 + (Number.isFinite(summary.mods.dexterity) ? summary.mods.dexterity : 0))}
                               onChange={(e) => set({armorClass: e.target.value === `` ? null : e.target.valueAsNumber})}/>
                    </Field>
                    <Field label="Speed (ft)" error={errors.speed}>
                        <input className="field__input" type="number" inputMode="numeric" min={0} max={200} step={5}
                               value={Number.isFinite(draft.speed) ? draft.speed : ``}
                               onChange={(e) => set({speed: e.target.valueAsNumber})}/>
                    </Field>
                </div>
            </section>

            <section className="character-form__section">
                <h3 className="character-form__heading">Personality <span className="field__optional">optional</span></h3>
                <div className="character-form__grid character-form__grid--two">
                    <Field label="Personality traits"><textarea className="field__input" rows={2} value={draft.personalityTraits} onChange={(e) => set({personalityTraits: e.target.value})}/></Field>
                    <Field label="Ideals"><textarea className="field__input" rows={2} value={draft.ideals} onChange={(e) => set({ideals: e.target.value})}/></Field>
                    <Field label="Bonds"><textarea className="field__input" rows={2} value={draft.bonds} onChange={(e) => set({bonds: e.target.value})}/></Field>
                    <Field label="Flaws"><textarea className="field__input" rows={2} value={draft.flaws} onChange={(e) => set({flaws: e.target.value})}/></Field>
                </div>
            </section>
        </>
    );
}
