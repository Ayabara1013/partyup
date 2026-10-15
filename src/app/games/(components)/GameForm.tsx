'use client'

import '@/styles/games/gameForm.scss';
import {FormEvent, ReactNode, useState} from "react";
import Link from "next/link";
import {gameSystems} from "@/lib/assets/gameSystems";
import {safetyChecks} from "@/lib/assets/safetyChecks";
import {firefoxNumberInputOnKeyDown} from "@/lib/util/browserFixes/firefox";

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
};

const LIMITS = {name: 80, description: 2000, minPlayers: 2, maxPlayers: 4, minAge: 10, maxAge: 99, tags: 10, tagLength: 24};
const SAFETY_KEYS = [`sc0`, `sc1`, `sc2`, `sc3`] as const;

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
        <div className="game-form-page">
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
                            <select className="field__input" value={draft.system} onChange={(e) => set(`system`, e.target.value)}>
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

                    <fieldset className="field">
                        <legend className="field__label">Safety tools <span className="field__optional">optional</span></legend>
                        <div className="game-form__tools">
                            {safetyChecks.array.map((check, i) => {
                                const key = SAFETY_KEYS[i];
                                return (
                                    <label key={key} className={`game-form__tool ${draft[key] ? `game-form__tool--on` : ``}`}>
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

                    {/* Visibility is fixed during testing, so it's shown rather than offered as a disabled toggle */}
                    <div className="field">
                        <span className="field__label">Visibility</span>
                        <div className="game-form__public">
                            <span className="badge badge-primary badge-outline">{draft.isPublic ? `Public` : `Private`}</span>
                            <span className="panel__hint">All games are public while PartyUp is in testing.</span>
                        </div>
                    </div>
                </div>

                <footer className="game-form__footer">
                    <Link href={cancelHref} className="btn btn-sm btn-ghost border border-neutral-content/20">Cancel</Link>
                    <button type="submit" className="btn btn-sm btn-primary" disabled={saving}>
                        {saving ? <span className="loading loading-spinner loading-xs"/> : submitLabel}
                    </button>
                </footer>
            </form>
        </div>
    );
}

function Field({label, hint, error, optional, children}: {
    label: string,
    hint?: string,
    error?: string,
    optional?: boolean,
    children: ReactNode
}) {
    return (
        <label className="field">
            <span className="field__label">{label}{optional && <span className="field__optional">optional</span>}</span>
            {children}
            {error ? <span className="field__error">{error}</span> : hint && <span className="panel__hint">{hint}</span>}
        </label>
    );
}
