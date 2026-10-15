import Field from "@/components/ui/field";
import type {Ability, Pf2eProficiency, Pf2eSkill} from "@/lib/assets/classes/characterSheet";
import {PF2E_SKILL_ABILITIES} from "@/lib/assets/classes/characterSheet";
import {ABILITIES, ABILITY_SHORT, PF2E_CLASSES, PF2E_PROFICIENCIES, PF2E_SKILL_LABELS} from "@/lib/character/options";
import {DraftErrors, Pf2eDraft, pf2eSummary, signed} from "@/lib/character/build";

type Props = {
    draft: Pf2eDraft;
    set: (patch: Partial<Pf2eDraft>) => void;
    errors: DraftErrors;
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const MODIFIERS = Array.from({length: 13}, (_, i) => i - 5); // -5 .. +7

function ProficiencySelect({value, onChange, className = `field__input`}: {
    value: Pf2eProficiency,
    onChange: (rank: Pf2eProficiency) => void,
    className?: string
}) {
    return (
        <select className={className} value={value} onChange={(e) => onChange(e.target.value as Pf2eProficiency)}>
            {PF2E_PROFICIENCIES.map((rank) => <option key={rank} value={rank}>{capitalize(rank)}</option>)}
        </select>
    );
}

export default function Pf2eFields({draft, set, errors}: Props) {
    const summary = pf2eSummary(draft);
    const classOption = PF2E_CLASSES.find((c) => c.name === draft.className);

    // Picking a class also picks a key attribute it allows
    const chooseClass = (name: string) => {
        const option = PF2E_CLASSES.find((c) => c.name === name);
        const keyAttribute = option && !option.keyAttributes.includes(draft.keyAttribute) ? option.keyAttributes[0] : draft.keyAttribute;
        set({className: name, keyAttribute});
    };

    return (
        <>
            <section className="character-form__section">
                <h3 className="character-form__heading">Class &amp; ancestry</h3>
                <div className="character-form__grid">
                    <Field label="Class" error={errors.className}>
                        <select className="field__input" value={draft.className} onChange={(e) => chooseClass(e.target.value)}>
                            <option value="" disabled>Choose a class</option>
                            {PF2E_CLASSES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    </Field>
                    <Field label="Level">
                        <select className="field__input" value={draft.level} onChange={(e) => set({level: Number(e.target.value)})}>
                            {Array.from({length: 20}, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                        </select>
                    </Field>
                    <Field label="Key attribute">
                        <select className="field__input" value={draft.keyAttribute} onChange={(e) => set({keyAttribute: e.target.value as Ability})}>
                            {(classOption?.keyAttributes ?? ABILITIES.map((a) => a.key)).map((key) =>
                                <option key={key} value={key}>{ABILITIES.find((a) => a.key === key)?.label}</option>)}
                        </select>
                    </Field>
                    <Field label="Ancestry" error={errors.lineage}>
                        <input className="field__input" value={draft.ancestry} placeholder="Elf"
                               onChange={(e) => set({ancestry: e.target.value})}/>
                    </Field>
                    <Field label="Heritage" optional>
                        <input className="field__input" value={draft.heritage} placeholder="Cavern elf"
                               onChange={(e) => set({heritage: e.target.value})}/>
                    </Field>
                    <Field label="Ancestry HP" error={errors.ancestryHp}>
                        <input className="field__input" type="number" inputMode="numeric" min={0} max={20}
                               value={Number.isFinite(draft.ancestryHp) ? draft.ancestryHp : ``}
                               onChange={(e) => set({ancestryHp: e.target.valueAsNumber})}/>
                    </Field>
                    <Field label="Background" optional>
                        <input className="field__input" value={draft.background} placeholder="Scholar"
                               onChange={(e) => set({background: e.target.value})}/>
                    </Field>
                </div>
                {classOption && <p className="panel__hint">{classOption.name}: {classOption.hp} HP per level, plus your Constitution modifier.</p>}
            </section>

            <section className="character-form__section">
                <h3 className="character-form__heading">Attribute modifiers</h3>
                <div className="ability-grid">
                    {ABILITIES.map(({key, label, short}) =>
                        <label key={key} className={`ability-box ${key === draft.keyAttribute ? `ability-box--key` : ``}`} title={label}>
                            <span className="ability-box__label">{short}</span>
                            <select className="ability-box__input" value={draft.attributes[key]}
                                    onChange={(e) => set({attributes: {...draft.attributes, [key]: Number(e.target.value)}})}>
                                {MODIFIERS.map((m) => <option key={m} value={m}>{signed(m)}</option>)}
                            </select>
                            <span className="ability-box__mod">{key === draft.keyAttribute ? `key` : ` `}</span>
                        </label>
                    )}
                </div>
                <p className="panel__hint">Final modifiers after ancestry, background, class and free boosts. A new character usually tops out at +4.</p>
            </section>

            <section className="character-form__section">
                <h3 className="character-form__heading">Proficiencies</h3>
                <div className="character-form__grid">
                    <Field label="Perception"><ProficiencySelect value={draft.perception} onChange={(perception) => set({perception})}/></Field>
                    <Field label="Fortitude"><ProficiencySelect value={draft.saves.fortitude} onChange={(r) => set({saves: {...draft.saves, fortitude: r}})}/></Field>
                    <Field label="Reflex"><ProficiencySelect value={draft.saves.reflex} onChange={(r) => set({saves: {...draft.saves, reflex: r}})}/></Field>
                    <Field label="Will"><ProficiencySelect value={draft.saves.will} onChange={(r) => set({saves: {...draft.saves, will: r}})}/></Field>
                </div>
                <div className="skill-list">
                    {(Object.keys(PF2E_SKILL_LABELS) as Pf2eSkill[]).map((skill) =>
                        <div key={skill} className={`skill-row ${draft.skills[skill] !== `untrained` ? `skill-row--trained` : ``}`}>
                            <span className="skill-row__name">
                                {PF2E_SKILL_LABELS[skill]} <span className="skill-row__ability">{ABILITY_SHORT[PF2E_SKILL_ABILITIES[skill]]}</span>
                            </span>
                            <span className="skill-row__total">{signed(summary.skill(skill))}</span>
                            <ProficiencySelect className="skill-row__select" value={draft.skills[skill]}
                                               onChange={(rank) => set({skills: {...draft.skills, [skill]: rank}})}/>
                        </div>
                    )}
                </div>
            </section>

            <section className="character-form__section">
                <h3 className="character-form__heading">Armor &amp; movement</h3>
                <div className="character-form__grid">
                    <Field label="Armor proficiency"><ProficiencySelect value={draft.armorProficiency} onChange={(armorProficiency) => set({armorProficiency})}/></Field>
                    <Field label="Armor item bonus" hint="0 when unarmored." error={errors.armor}>
                        <select className="field__input" value={draft.armorItemBonus} onChange={(e) => set({armorItemBonus: Number(e.target.value)})}>
                            {Array.from({length: 7}, (_, i) => <option key={i} value={i}>{signed(i)}</option>)}
                        </select>
                    </Field>
                    <Field label="Dex cap">
                        <select className="field__input" value={draft.dexterityCap ?? ``}
                                onChange={(e) => set({dexterityCap: e.target.value === `` ? null : Number(e.target.value)})}>
                            <option value="">None</option>
                            {Array.from({length: 6}, (_, i) => <option key={i} value={i}>{signed(i)}</option>)}
                        </select>
                    </Field>
                    <Field label="Speed (ft)" error={errors.speed}>
                        <input className="field__input" type="number" inputMode="numeric" min={0} max={200} step={5}
                               value={Number.isFinite(draft.speed) ? draft.speed : ``}
                               onChange={(e) => set({speed: e.target.valueAsNumber})}/>
                    </Field>
                </div>
            </section>
        </>
    );
}
