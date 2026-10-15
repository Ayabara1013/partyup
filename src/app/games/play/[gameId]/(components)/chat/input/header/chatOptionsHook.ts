import {KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {isKeyHotkey} from "is-hotkey";
import {BaseEditor, Transforms} from "slate";
import {ReactEditor} from "slate-react";
import {editorFix, editorTools} from "@/components/slatejs/util/editorUtil";
import type {ChatOption} from "@/app/games/play/[gameId]/(components)/chat/input/header/chatOptionHeader";

type CustomEditor = BaseEditor & ReactEditor;

// Most suggestions shown at once
const MAX_OPTIONS = 9;

// A suggestion list opens when the word at the cursor starts with one of these
// ("name@site" or "and/or" don't open anything)
const OPTION_TRIGGERS = {
    mention: /^@(?![{ ])/,
    command: /^\/(?![\d ])/,
} as const;

type OptionType = keyof typeof OPTION_TRIGGERS;

const OPTION_TITLES: Record<OptionType, string> = {mention: `Members`, command: `Commands`};

const DEFAULT_COMMANDS = [`roll`, `mute`];

type Member = ChatOption & { search: string };

type OptionMenu = {
    fragment: string; // the word being completed, e.g. "@an"
    type: OptionType | null;
    items: ChatOption[];
};

// One shared object, so closing an already-closed menu doesn't re-render
const CLOSED: OptionMenu = {fragment: ``, type: null, items: []};

export function detectOptionType(word: string): OptionType | null {
    if (OPTION_TRIGGERS.mention.test(word)) return `mention`;
    if (OPTION_TRIGGERS.command.test(word)) return `command`;
    return null;
}

// What to suggest for the word at the cursor
export function buildOptionMenu(word: string, members: Member[], commands: string[]): OptionMenu {
    const type = detectOptionType(word);
    if (!type) return CLOSED;

    const query = word.slice(1).toLowerCase();
    const items = type === `mention`
        ? members.filter((m) => m.search.includes(query))
        : commands.filter((c) => c.includes(query)).map((c) => ({name: c, value: c}));

    return {fragment: word, type, items: items.slice(0, MAX_OPTIONS)};
}

export const useChatOptions = (editor: CustomEditor, game: any) => {
    const [menu, setMenu] = useState<OptionMenu>(CLOSED);
    const [highlightIndex, setHighlightIndex] = useState(0);

    // The GM and every player, for @mention suggestions (lowercased once, not per keystroke)
    const members = useMemo<Member[]>(() => (game ? [...(game.players ?? []), game.gm] : [])
        .filter(Boolean)
        .map((p: any) => ({value: p.id, name: p.name, search: (p.name ?? ``).toLowerCase()})), [game]);

    const close = () => {
        setMenu(CLOSED);
        setHighlightIndex(0);
    };

    // Runs on every keyup
    const updateOptionsFilter = (commands: string[] = DEFAULT_COMMANDS) => {
        const next = buildOptionMenu(editorTools.offset.focusedFragment(editor) ?? ``, members, commands);
        if (next === CLOSED) return close();

        setMenu(next);
        setHighlightIndex((i) => i < next.items.length ? i : 0);
    };

    const insertOptionIntoEditor = (index: number = highlightIndex) => {
        const item = menu.items[index];
        const focus = editorTools.offset.findFocus(editor, menu.fragment);
        if (!item || !menu.type || !focus) return;

        // Replace the typed fragment ("@an", "/ro") with the choice
        Transforms.select(editor, focus);
        Transforms.delete(editor, {distance: menu.fragment.length, unit: `character`, reverse: true});

        if (menu.type === `mention`) {
            // Discord-style pill: shows @Name, sends <@userId>
            Transforms.insertNodes(editor, {
                type: `badge`,
                featureType: `mention`,
                value: `<@${item.value}>`,
                children: [{text: `@${item.name}`}],
            });
            Transforms.move(editor, {unit: `offset`});
            Transforms.insertText(editor, ` `);
        } else {
            Transforms.insertText(editor, `/${item.name} `);
        }

        close();
    };

    // Returns true when the key was handled here (so the input shouldn't also send on Enter)
    const cycleOptionIndex = (e: KeyboardEvent<HTMLDivElement>) => {
        const {nativeEvent} = e;

        if (isKeyHotkey(`escape`, nativeEvent)) {
            close();
            return true;
        }

        const max = menu.items.length;
        if (max === 0) return false;

        if (isKeyHotkey([`up`, `down`, `tab`], nativeEvent)) {
            e.preventDefault();
            const step = isKeyHotkey(`up`, nativeEvent) ? -1 : 1;
            setHighlightIndex((i) => (i + step + max) % max);
        }

        if (isKeyHotkey(`enter`, nativeEvent)) {
            e.preventDefault();
            insertOptionIntoEditor();
            return true;
        }

        return false;
    };

    // Stable click handler (so the memoized header doesn't re-render) that always runs the latest insert
    const insertRef = useRef(insertOptionIntoEditor);
    useEffect(() => {
        insertRef.current = insertOptionIntoEditor;
    });

    const selectOption = useCallback((index: number) => {
        ReactEditor.focus(editor);
        insertRef.current(index);
        editorFix.keyUp(undefined, editor);
    }, [editor]);

    const headerProps = useMemo(() => ({
        title: menu.type ? OPTION_TITLES[menu.type] : ``,
        list: menu.items,
        highlightIndex,
        onSelect: selectOption,
    }), [menu, highlightIndex, selectOption]);

    return {cycleOptionIndex, updateOptionsFilter, headerProps};
};
