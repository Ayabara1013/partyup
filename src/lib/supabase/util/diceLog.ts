// Normalizes the `log` column on game_chat_messages for display.
// New shape (command_roll edge function): {input, formula, rolled, result, total, totalsByType, groups} or {input, error}
// The GM's changes (adjust_roll in the database) add adjustments[] and base {total, totalsByType, result}, and
// update total, totalsByType and result; groups stay as rolled.
// Legacy shape: Array<{rollTotal, rollLog[], label}>
//
// A modifier from a character tag shows its source instead of "flat": 3 (Strength)
// After the dice lines, one line per adjustment: Circumstance +2: cover (with [part] when the roll has several)
//
// Display, one line per damage group, then the totals:
//   /roll 2d20 [fire] + 3d6 + 6 [water]
//   2d20 [fire] -> 15 + 5 = 20 [fire]
//   3d6 [water] -> 3 + 3 + 2 + 6 (flat) = 14 [water]
//   Fire: 20, Water: 14

import {capitalize} from "@/lib/util/strings";

export type DiceLogSummary = {
    lines: string[];
    totals: string;
    error: string | null;
};

type Term =
    | { kind: `dice`, sign: number, count: number, sides: number, rolls: number[] }
    | { kind: `flat`, sign: number, value: number, source?: string }; // source: the character tag it came from

type Group = { label: string, multiplier: number, terms: Term[], total: number };

type Adjustment = { kind: string, value: number, label?: string | null, group: number };

function formatTotals(totalsByType: Record<string, number>) {
    return Object.entries(totalsByType)
        .map(([type, value]) => `${capitalize(type)}: ${value}`)
        .join(`, `);
}

function joinSignedText(parts: { sign: number, text: string }[]) {
    return parts
        .map((p, i) => i === 0 ? `${p.sign < 0 ? `-` : ``}${p.text}` : `${p.sign < 0 ? `-` : `+`} ${p.text}`)
        .join(` `);
}

function formatGroup(group: Group) {
    const dice = group.terms.filter((t) => t.kind === `dice`) as Extract<Term, { kind: `dice` }>[];

    // Left side: the dice rolled (or the flat values if there are no dice)
    const notation = dice.length
        ? joinSignedText(dice.map((t) => ({sign: t.sign, text: `${t.count}d${t.sides}`})))
        : joinSignedText(group.terms.map((t) => ({sign: t.sign, text: t.kind === `flat` ? (t.source ?? `${t.value}`) : ``})));

    // Right side: every die result, then flat modifiers marked "(flat)"
    const rolled = joinSignedText(group.terms.flatMap((t) => t.kind === `dice`
        ? t.rolls.map((r) => ({sign: t.sign, text: `${r}`}))
        : [{sign: t.sign, text: `${t.value} (${t.source ?? `flat`})`}]));

    const multiplied = group.multiplier !== 1;
    const left = multiplied ? `${group.multiplier} × (${notation})` : notation;
    const right = multiplied ? `${group.multiplier} × (${rolled})` : rolled;

    const label = group.label ? ` [${group.label}]` : ``;
    return `${left}${label} -> ${right} = ${group.total}${label}`;
}

function formatAdjustment(adjustment: Adjustment, groups: Group[]) {
    const value = `${adjustment.value < 0 ? `-` : `+`}${Math.abs(adjustment.value)}`;
    // Which part it went to, when the roll has several
    const part = groups.length > 1 ? ` [${groups[adjustment.group]?.label || `untyped`}]` : ``;
    const note = adjustment.label ? `: ${adjustment.label}` : ``;
    return `${capitalize(adjustment.kind)} ${value}${part}${note}`;
}

export function summarizeDiceLog(log: any): DiceLogSummary | null {
    if (!log) return null;

    if (Array.isArray(log)) {
        const totalsByType: Record<string, number> = {};
        const lines: string[] = [];
        log.forEach((entry: any) => {
            const value = Number(entry?.rollTotal) || 0;
            const type = entry?.label || `untyped`;
            totalsByType[type] = (totalsByType[type] ?? 0) + value;
            (entry?.rollLog ?? []).forEach((line: string) => lines.push(line));
        });
        return {lines, totals: formatTotals(totalsByType), error: null};
    }

    if (typeof log === `object`) {
        if (log.error) return {lines: [], totals: ``, error: String(log.error)};
        const groups: Group[] = Array.isArray(log.groups) ? log.groups : [];
        const adjustments: Adjustment[] = Array.isArray(log.adjustments) ? log.adjustments : [];
        return {
            lines: [...groups.map(formatGroup), ...adjustments.map((a) => formatAdjustment(a, groups))],
            totals: formatTotals(log.totalsByType ?? {}),
            error: null
        };
    }

    return null;
}
