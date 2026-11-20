'use client'

import '@/styles/games/gameForm.scss';
import {FormEvent, useState} from "react";
import Field from "@/components/ui/field";
import Link from "next/link";
import {gameSystems} from "@/lib/assets/gameSystems";
import {safetyChecks, SAFETY_COLUMNS} from "@/lib/assets/safetyChecks";
import {firefoxNumberInputOnKeyDown} from "@/lib/util/browserFixes/firefox";
import {SUBTLE_BUTTON} from "@/components/ui/buttonClasses";
import SearchSelect from "@/components/ui/searchSelect";

// Shape create.game / edit.game expect
export type GameFormValues = {
    name: string;
    description: string;
    system: string;
    maxPlayers: number;
    ageRes: number;
    sc0: boolean;
    sc1: boolean;
    sc2: boolean;
    sc3: boolean;
    tags: string[];
    isPublic: boolean;
    premade: string | null; // a name from the system's premade list, or null
};

export const EMPTY_GAME: GameFormValues = {
    name: ``,
    description: ``,
    system: gameSystems.array[0].value,
    maxPlayers: 4,
    ageRes: 10,
    sc0: false,
    sc1: false,
    sc2: false,
    sc3: false,
    tags: [],
    isPublic: true,
    premade: null,
};

const LIMITS = {name: 80, description: 2000, minPlayers: 2, maxPlayers: 4, minAge: 10, maxAge: 99, tags: 10, tagLength: 24};

const VISIBILITY = [
    {value: true, title: `Public`, hint: `Listed on Discover until it starts. Anyone can ask to join.`},
    {value: false, title: `Private`, hint: `Not listed. Only people with the invite link can find it and ask to join.`},
] as const;

// "Dnd, ocean ,, World" -> ["dnd", "ocean", "world"]
function parseTags(text: string) {
    return [...new Set(text.split(`,`).map((t) => t.trim().toLowerCase()).filter(Boolean))];
}

type Draft = Omit<GameFormValues, `tags`> & { tagsText: string };
type Errors = Partial<Record<`name` | `maxPlayers` | `ageRes` | `tags`, string>>;

function validate(draft: Draft, minPlayers: number): Errors {
    const errors: Errors = {};
    const tags = parseTags(draft.tagsText);

    if (!draft.name.trim()) errors.name = `Give your game a name.`;

    if (!Number.isInteger(draft.maxPlayers) || draft.maxPlayers < minPlayers || draft.maxPlayers > LIMITS.maxPlayers) {
        errors.maxPlayers = minPlayers > LIMITS.minPlayers
            ? `Between ${minPlayers} (players already in the game) and ${LIMITS.maxPlayers}.`
            : `Between ${LIMITS.minPlayers} and ${LIMITS.maxPlayers}.`;
    }

    if (!Number.isInteger(draft.ageRes) || draft.ageRes < LIMITS.minAge || draft.ageRes > LIMITS.maxAge) {
        errors.ageRes = `Between ${LIMITS.minAge} and ${LIMITS.maxAge}.`;
    }

    if (tags.length > LIMITS.tags) errors.tags = `Up to ${LIMITS.tags} tags.`;
    else if (tags.some((t) => t.length > LIMITS.tagLength)) errors.tags = `Each tag can be up to ${LIMITS.tagLength} characters.`;

    return errors;
}

type GameFormProps = {
    title: string;
    description: string;
    initial?: GameFormValues;
    // Edit: can't go below the number of players already in the game
    currentPlayers?: number;
    submitLabel: string;
    cancelHref: string;
    onSubmit: (values: GameFormValues) => Promise<boolean>;
};

export default function GameForm({title, description, initial = EMPTY_GAME, currentPlayers = 0, submitLabel, cancelHref, onSubmit}: GameFormProps) {
    const [draft, setDraft] = useState<Draft>(() => {
        const {tags, ...rest} = initial;
        return {...rest, tagsText: tags.join(`, `)};
    });
    const [submitted, setSubmitted] = useState(false);
    const [saving, setSaving] = useState(false);

    const minPlayers = Math.max(LIMITS.minPlayers, currentPlayers);
    const errors = validate(draft, minPlayers);
    const shownErrors = submitted ? errors : {};
    const tagPreview = parseTags(draft.tagsText);
    const premadeNames = gameSystems.array.find((s) => s.value === draft.system)?.premade ?? [];

    const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((d) => ({...d, [key]: value}));

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
        if (Object.keys(errors).length > 0 || saving) return;

        const {tagsText, ...rest} = draft;
        setSaving(true);
        const ok = await onSubmit({...rest, name: rest.name.trim(), description: rest.description.trim(), tags: parseTags(tagsText)});
        if (!ok) setSaving(false); // on success the page navigates away
    };

    return (
        <div className="centered-page">
            <form className="panel game-form" onSubmit={submit} noValidate>
                <header className="panel__bar">
                    <div className="panel__title">
                        <span className="panel__name">{title}</span>
                        <span className="panel__desc">{description}</span>
                    </div>
                </header>

                <div className="panel__body game-form__body">
                    <Field label="Name" error={shownErrors.name}>
                        <input className="field__input" value={draft.name} maxLength={LIMITS.name} autoFocus
                               placeholder="Curse of Varn" onChange={(e) => set(`name`, e.target.value)}/>
                    </Field>

                    <Field label="Description" hint="What players should know before asking to join.">
                        <textarea className="field__input" rows={4} value={draft.description} maxLength={LIMITS.description}
                                  onChange={(e) => set(`description`, e.target.value)}/>
                    </Field>

                    <div className="game-form__row">
                        <Field label="System">
                            {/* A premade campaign belongs to one system, so changing the system clears it */}
                            <select className="field__input" value={draft.system}
                                    onChange={(e) => setDraft((d) => ({...d, system: e.target.value, premade: null}))}>
                                {gameSystems.array.map((system) =>
                                    <option key={system.value} value={system.value}>{system.title}</option>)}
                            </select>
                        </Field>

                        <Field label="Players" hint="Not counting you." error={shownErrors.maxPlayers}>
                            <input className="field__input" type="number" inputMode="numeric"
                                   min={minPlayers} max={LIMITS.maxPlayers} value={Number.isNaN(draft.maxPlayers) ? `` : draft.maxPlayers}
                                   onKeyDown={firefoxNumberInputOnKeyDown}
                                   onChange={(e) => set(`maxPlayers`, e.target.valueAsNumber)}/>
                        </Field>

                        <Field label="Minimum age" hint="10 is the site default." error={shownErrors.ageRes}>
                            <input className="field__input" type="number" inputMode="numeric"
                                   min={LIMITS.minAge} max={LIMITS.maxAge} value={Number.isNaN(draft.ageRes) ? `` : draft.ageRes}
                                   onKeyDown={firefoxNumberInputOnKeyDown}
                                   onChange={(e) => set(`ageRes`, e.target.valueAsNumber)}/>
                        </Field>
                    </div>

                    {premadeNames.length > 0 &&
                      <div className="field">
                          <label className="field__label" htmlFor="game-premade">
                              Premade campaign<span className="field__optional">optional</span>
                          </label>
                          <SearchSelect id="game-premade" groups={[{options: premadeNames}]} value={draft.premade} noneLabel="None"
                                        onChange={(premade) => set(`premade`, premade)}/>
                          <span className="panel__hint">Type to search. Leave on None for a homebrew game.</span>
                      </div>}

                    <fieldset className="field">
                        <legend className="field__label">Safety tools <span className="field__optional">optional</span></legend>
                        <div className="game-form__tools">
                            {safetyChecks.array.map((check, i) => {
                                const key = SAFETY_COLUMNS[i];
                                return (
                                    <label key={key} className={`game-form__tool soft-card ${draft[key] ? `game-form__tool--on` : ``}`}>
                                        <input type="checkbox" className="checkbox checkbox-primary checkbox-sm"
                                               checked={draft[key]} onChange={(e) => set(key, e.target.checked)}/>
                                        {check.title}
                                    </label>
                                );
                            })}
                        </div>
                        <span className="panel__hint">You can change these later.</span>
                    </fieldset>

                    <Field label="Tags" optional hint="Separate tags with commas." error={shownErrors.tags}>
                        <input className="field__input" value={draft.tagsText} placeholder="horror, beginner friendly"
                               onChange={(e) => set(`tagsText`, e.target.value)}/>
                        {tagPreview.length > 0 &&
                          <div className="game-form__tags">
                              {tagPreview.map((tag) => <span key={tag} className="badge badge-ghost badge-sm">#{tag}</span>)}
                          </div>}
                    </Field>

                    <fieldset className="field">
                        <legend className="field__label">Visibility</legend>
                        <div className="game-form__options">
                            {VISIBILITY.map((option) =>
                                <label key={option.title}
                                       className={`game-form__option soft-card ${draft.isPublic === option.value ? `game-form__option--on` : ``}`}>
                                    <input type="radio" name="visibility" className="radio radio-primary radio-sm"
                                           checked={draft.isPublic === option.value} onChange={() => set(`isPublic`, option.value)}/>
                                    <span className="game-form__option-text">
                                        <span className="game-form__option-title">{option.title}</span>
                                        <span className="panel__hint">{option.hint}</span>
                                    </span>
                                </label>
                            )}
                        </div>
                    </fieldset>
                </div>

                <footer className="game-form__footer panel__footer">
                    <Link href={cancelHref} className={SUBTLE_BUTTON}>Cancel</Link>
                    <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>
                        {saving ? <span className="loading loading-spinner loading-xs"/> : submitLabel}
                    </button>
                </footer>
            </form>
        </div>
    );
}
