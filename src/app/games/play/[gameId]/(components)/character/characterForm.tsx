'use client'

import '@/styles/games/character.scss';
import {FormEvent, useEffect, useState} from "react";
import Field from "@/components/ui/field";
import type {CharacterSheet, Dnd5eSkill, Pf2eSkill} from "@/lib/assets/classes/characterSheet";
import {DND5E_SKILL_ABILITIES, PF2E_SKILL_ABILITIES} from "@/lib/assets/classes/characterSheet";
import {ABILITY_SHORT, SIZES} from "@/lib/character/options";
import {
    buildDnd5eSheet, buildPf2eSheet, Dnd5eDraft, dnd5eSummary, Pf2eDraft, pf2eSummary, SharedDraft, signed, validateDraft,
} from "@/lib/character/build";
import Dnd5eFields from "./dnd5eFields";
import Pf2eFields from "./pf2eFields";

export type CharacterSystem = `dnd5e` | `pf2e`;

const SYSTEM_LABELS: Record<CharacterSystem, string> = {dnd5e: `D&D 5e`, pf2e: `Pathfinder 2e`};

const sharedDefaults = (speed: number): SharedDraft => ({
    name: ``, background: ``, languages: `Common`, size: `Medium`, speed, appearance: ``, backstory: ``,
});

const newDnd5eDraft = (): Dnd5eDraft => ({
    ...sharedDefaults(30),
    race: ``, className: ``, subclass: ``, level: 1, alignment: ``,
    scores: {strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10},
    skills: Object.fromEntries(Object.keys(DND5E_SKILL_ABILITIES).map((s) => [s, `none`])) as Dnd5eDraft[`skills`],
    armorClass: null, personalityTraits: ``, ideals: ``, bonds: ``, flaws: ``,
});

const newPf2eDraft = (): Pf2eDraft => ({
    ...sharedDefaults(25),
    ancestry: ``, heritage: ``, ancestryHp: 8, className: ``, keyAttribute: `strength`, level: 1,
    attributes: {strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0},
    perception: `trained`, saves: {fortitude: `trained`, reflex: `trained`, will: `trained`},
    skills: Object.fromEntries(Object.keys(PF2E_SKILL_ABILITIES).map((s) => [s, `untrained`])) as Pf2eDraft[`skills`],
    armorProficiency: `trained`, armorItemBonus: 0, dexterityCap: null,
});

type CharacterFormProps = {
    system: CharacterSystem;
    gameName: string;
    playerName: string;
    onClose: () => void;
    onSubmit: (sheet: CharacterSheet) => Promise<boolean>;
};

// Character creator, shown as a popup over the Canon chat on the play page
export default function CharacterForm({system, gameName, playerName, onClose, onSubmit}: CharacterFormProps) {
    const [dnd, setDnd] = useState<Dnd5eDraft>(newDnd5eDraft);
    const [pf, setPf] = useState<Pf2eDraft>(newPf2eDraft);
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);

    const draft = system === `dnd5e` ? dnd : pf;
    const setShared = (patch: Partial<SharedDraft>) =>
        system === `dnd5e` ? setDnd((d) => ({...d, ...patch})) : setPf((d) => ({...d, ...patch}));

    // Escape closes the popup (unless it's in the middle of saving)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === `Escape` && !saving) onClose();
        };
        document.addEventListener(`keydown`, onKey);
        return () => document.removeEventListener(`keydown`, onKey);
    }, [onClose, saving]);

    const errors = validateDraft(system, draft);
    const shownErrors = submitted ? errors : {};

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        if (Object.keys(errors).length > 0 || saving) return;

        const id = crypto.randomUUID();
        const sheet = system === `dnd5e` ? buildDnd5eSheet(dnd, id, playerName) : buildPf2eSheet(pf, id, playerName);
        setSaving(true);
        if (!await onSubmit(sheet)) setSaving(false); // on success the popup closes
    };

    return (
        <form className="panel character-form" onSubmit={submit} noValidate role="dialog" aria-label="Create a character">
                <header className="panel__bar">
                    <div className="panel__title">
                        <span className="panel__name">Create a character</span>
                        <span className="panel__desc">{gameName} · {SYSTEM_LABELS[system]}</span>
                    </div>
                    <button type="button" className="btn btn-sm btn-ghost btn-circle" onClick={onClose}
                            disabled={saving} aria-label="Close">✕</button>
                </header>

                <div className="panel__body character-form__body">
                    {system === `dnd5e` ? <Dnd5eSummaryStrip draft={dnd}/> : <Pf2eSummaryStrip draft={pf}/>}

                    <section className="character-form__section">
                        <h3 className="character-form__heading">Basics</h3>
                        <div className="character-form__grid">
                            <Field label="Character name" error={shownErrors.name} className="character-form__span-2">
                                <input className="field__input" value={draft.name} maxLength={60} autoFocus
                                       onChange={(e) => setShared({name: e.target.value})}/>
                            </Field>
                            <Field label="Size">
                                <select className="field__input" value={draft.size} onChange={(e) => setShared({size: e.target.value})}>
                                    {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </Field>
                            <Field label="Languages" hint="Separate with commas." className="character-form__span-3">
                                <input className="field__input" value={draft.languages} onChange={(e) => setShared({languages: e.target.value})}/>
                            </Field>
                        </div>
                    </section>

                    {system === `dnd5e`
                        ? <Dnd5eFields draft={dnd} set={(patch) => setDnd((d) => ({...d, ...patch}))} errors={shownErrors}/>
                        : <Pf2eFields draft={pf} set={(patch) => setPf((d) => ({...d, ...patch}))} errors={shownErrors}/>}

                    <section className="character-form__section">
                        <h3 className="character-form__heading">Story <span className="field__optional">optional</span></h3>
                        <div className="character-form__grid character-form__grid--two">
                            <Field label="Appearance">
                                <textarea className="field__input" rows={3} value={draft.appearance} onChange={(e) => setShared({appearance: e.target.value})}/>
                            </Field>
                            <Field label="Backstory">
                                <textarea className="field__input" rows={3} value={draft.backstory} onChange={(e) => setShared({backstory: e.target.value})}/>
                            </Field>
                        </div>
                    </section>
                </div>

                <footer className="character-form__footer">
                    {submitted && Object.keys(errors).length > 0 &&
                      <span className="field__error mr-auto">Fix the highlighted fields to continue.</span>}
                    <button type="button" className="btn btn-sm btn-ghost border border-neutral-content/20" onClick={onClose}
                            disabled={saving}>Cancel</button>
                    <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>
                        {saving ? <span className="loading loading-spinner loading-xs"/> : `Create character`}
                    </button>
                </footer>
        </form>
    );
}

// ---------- Live summary strip (top of the form, stays visible while scrolling) ----------

const finite = (n: number) => Number.isFinite(n);
const show = (n: number | null) => n === null || !finite(n) ? `—` : String(n);
const showSigned = (n: number) => finite(n) ? signed(n) : `—`;

function SummaryStrip({title, subtitle, stats, saves}: {
    title: string, subtitle: string, stats: [string, string][], saves: [string, string][]
}) {
    return (
        <div className="character-summary">
            <div className="character-summary__who">
                <span className="character-summary__name">{title || `Unnamed character`}</span>
                <span className="panel__hint">{subtitle || `Choose a class`}</span>
            </div>
            <dl className="character-summary__stats">
                {stats.map(([label, value]) =>
                    <div key={label} className="character-summary__stat"><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <dl className="character-summary__saves">
                <span className="character-summary__saves-label">Saves</span>
                {saves.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
        </div>
    );
}

function Dnd5eSummaryStrip({draft}: { draft: Dnd5eDraft }) {
    const s = dnd5eSummary(draft);
    const top = (Object.keys(DND5E_SKILL_ABILITIES) as Dnd5eSkill[]).filter((k) => draft.skills[k] !== `none`).length;
    return (
        <SummaryStrip
            title={draft.name.trim()}
            subtitle={[draft.race.trim(), draft.className && `${draft.className} ${s.level}`].filter(Boolean).join(` · `)}
            stats={[
                [`Hit points`, show(s.hitPoints)], [`Armor class`, show(s.armorClass)],
                [`Initiative`, showSigned(s.initiative)], [`Proficiency`, signed(s.prof)],
                [`Passive perception`, show(s.passivePerception)], [`Skills trained`, String(top)],
            ]}
            saves={(Object.keys(s.saves) as (keyof typeof s.saves)[]).map((a) => [ABILITY_SHORT[a], showSigned(s.saves[a])])}
        />
    );
}

function Pf2eSummaryStrip({draft}: { draft: Pf2eDraft }) {
    const s = pf2eSummary(draft);
    const trained = (Object.keys(PF2E_SKILL_ABILITIES) as Pf2eSkill[]).filter((k) => draft.skills[k] !== `untrained`).length;
    return (
        <SummaryStrip
            title={draft.name.trim()}
            subtitle={[draft.ancestry.trim(), draft.className && `${draft.className} ${s.level}`].filter(Boolean).join(` · `)}
            stats={[
                [`Hit points`, show(s.hitPoints)], [`Armor class`, show(s.armorClass)],
                [`Perception`, signed(s.perception)], [`Class DC`, show(s.classDC)],
                [`Speed`, finite(draft.speed) ? `${draft.speed} ft` : `—`], [`Skills trained`, String(trained)],
            ]}
            saves={[[`Fort`, signed(s.saves.fortitude)], [`Ref`, signed(s.saves.reflex)], [`Will`, signed(s.saves.will)]]}
        />
    );
}
