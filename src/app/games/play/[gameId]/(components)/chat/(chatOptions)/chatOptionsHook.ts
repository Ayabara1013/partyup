import {useEffect, useState, RefObject, KeyboardEvent, MouseEvent} from "react";
import {isKeyHotkey} from "is-hotkey";
import {Transforms, BaseEditor, Point} from "slate";
import {ReactEditor} from "slate-react";
import toast from "react-hot-toast";
import chatOptions from "@/lib/assets/chatOptions";
import {editorFix, editorTools} from "@/components/slatejs/util/editorUtil";

type ChatOption = {
    value: string;
    name: string;
};

type ChatOptionsRefs = {
    mainRef: RefObject<HTMLElement | null>;
    optionRefs: RefObject<HTMLButtonElement | null>[];
};

type CustomEditor = BaseEditor & ReactEditor;

function addToList(member: ChatOption, list: ChatOption[]) {
    if (!list.includes(member)) {
        list.push(member);
    }
}

export const useChatOptions = (chatOptionsRefs: ChatOptionsRefs, editor: CustomEditor, game: any) => {
    const optionTypes = ["mention", "command", "dice"] as const;
    const [playerList, setPlayerList] = useState<ChatOption[]>([]);
    const [itemList, setItemList] = useState<ChatOption[]>([]);
    const [textFragment, setTextFragment] = useState("");
    const [optionHighlightIndex, setOptionHighlightIndex] = useState(0);

    const {mainRef} = chatOptionsRefs;
    const highlightStyle = "input-accent";

    const featureRegex = {
        mention: /@(?![{ ])/,
        command: /\/(?![\d ])/,
        dice: /~(?! )/,
    };

    useEffect(() => {
        if (game) {
            const tempPlayerList: ChatOption[] = [];
            // console.log(game)
            for (const player of game.players) {
                tempPlayerList.push({
                    value: player.id,
                    name: player.name,
                });
            }
            tempPlayerList.push({
                value: game.gm.id,
                name: game.gm.name,
            });

            setPlayerList(tempPlayerList);
        }
    }, [game]);

    useEffect(() => {
        const classes = highlightStyle.split(" ");

        if (itemList.length > 0) {
            for (let i = 0; i < 9; i++) {
                const listRef = chatOptionsRefs.optionRefs[i]?.current;

                if (listRef) {
                    listRef.classList.remove(...classes);

                    if (i === optionHighlightIndex) {
                        listRef.classList.add(...classes);
                    }
                }
            }
        }
    }, [optionHighlightIndex, itemList.length, chatOptionsRefs.optionRefs]);

    const cycleOptionIndex = (e: KeyboardEvent<HTMLDivElement>) => {
        const {nativeEvent} = e;
        const max = itemList.length;

        if (isKeyHotkey("escape", nativeEvent)) {
            setTextFragment("");
            setItemList([]);
            setOptionHighlightIndex(0);
            return true;
        }

        if (max > 0) {
            if (isKeyHotkey(["up", "down", "tab"], nativeEvent)) {
                e.preventDefault();

                const newIndex =
                    optionHighlightIndex +
                    (isKeyHotkey("up", nativeEvent) ? -1 : 1);

                setOptionHighlightIndex(
                    newIndex < 0
                        ? max - 1
                        : newIndex >= max
                            ? 0
                            : newIndex
                );
            }

            if (isKeyHotkey("enter", nativeEvent)) {
                e.preventDefault();
                insertOptionIntoEditor();
                return true;
            }
        }

        return false;
    };

    const updateOptionsFilter = (availableCommands: string[] = ["roll", "mute"]) => {
        const word = editorTools.offset.focusedFragment(editor) as string;
        let fragment: string | undefined;

        const baseOptionPopulater = {
            mention: playerList,
            command: availableCommands,
            dice: [],
        };

        const newOptions: ChatOption[] = [];

        for (const type of optionTypes) {
            if (!featureRegex[type].test(word)) continue;
            fragment = word;
            switch (type) {
                case "mention":
                    filterOptions.mention(word, playerList, newOptions);
                    break;

                case "command":
                    filterOptions.command(word, availableCommands, newOptions);
                    break;

                case "dice":
                    filterOptions.dice(word, [], newOptions);
                    break;
            }

            break;
        }

        if (!fragment) setOptionHighlightIndex(0);

        setTextFragment(fragment || "");
        setItemList(newOptions);
    };

    const insertOptionIntoEditor = (index?: number) => {
        let featureType: typeof optionTypes[number] = "mention";

        for (const type of optionTypes) {
            if (featureRegex[type].test(textFragment)) {
                featureType = type;
                break;
            }
        }

        index ??= optionHighlightIndex;

        const newFocus = editorTools.offset.findFocus(
            editor,
            textFragment
        ) as Point;

        const badgeText =
            featureType !== "dice"
                ? `${textFragment[0]}${itemList[index].name}`
                : textFragment;

        if (featureType === "dice" && itemList.length === 1) {
            toast.error(
                "Invalid dice format entered. The system will not roll when message is sent."
            );
        }

        Transforms.setSelection(editor, {
            focus: newFocus,
            anchor: newFocus,
        });

        if (!editor.selection) return;

        Transforms.delete(editor, {
            at: editor.selection.focus,
            distance: textFragment.length,
            unit: "character",
            reverse: true,
        });

        Transforms.insertText(editor, badgeText + " ");

        setTextFragment("");
        setItemList([]);
        setOptionHighlightIndex(0);
    };

    const selectOption = (e?: MouseEvent<HTMLButtonElement>) => {
        e?.preventDefault();

        ReactEditor.focus(editor);

        insertOptionIntoEditor(
            e ? Number(e.currentTarget.value) : optionHighlightIndex
        );

        editorFix.keyUp(undefined, editor);
    };

    const optionStyle = (): React.CSSProperties => {
        const editorElement = mainRef.current;
        const dimensionsTA = editorElement?.getBoundingClientRect();

        if (!editorElement || !dimensionsTA) return {};

        return {
            bottom: window.innerHeight - dimensionsTA.y + 5,
            left: dimensionsTA.x,
            width: dimensionsTA.width,
        };
    };

    const optionProps = () => ({
        list: itemList,
        highlightStyle,
        style: optionStyle(),
        onClick: selectOption,
    });

    return {cycleOptionIndex, updateOptionsFilter, optionProps};
};

const filterOptions = {
    mention(word: string, playerList: ChatOption[], newOptionList: ChatOption[]) {
        const formattedWord = word.toLowerCase().replace("@", "");

        for (const player of playerList) {
            if (player.name.toLowerCase().includes(formattedWord)) {
                addToList(player, newOptionList);
            }
        }
    },

    command(word: string, availableCommands: string[], newOptionList: ChatOption[]) {
        const formattedFragment = word.toLowerCase().replace("/", "");

        for (const command of availableCommands) {
            if (command.includes(formattedFragment)) {
                newOptionList.push({
                    name: command,
                    value: command,
                });
            }
        }
    },

    dice(word: string, _unused: unknown[], newOptionList: ChatOption[]) {
        const formattedWord = word.toLowerCase().replace("~", "");

        if (chatOptions.values.dice.single.test(formattedWord)) {
            newOptionList.push({
                name: "Single Roll, Single Die",
                value: "SRSD",
            });
        }

        if (chatOptions.values.dice.multi.test(formattedWord)) {
            newOptionList.push({
                name: "Multi Roll, Single Die",
                value: "MRSD",
            });
        }

        if (chatOptions.values.dice.sequence.test(formattedWord)) {
            newOptionList.push({
                name: "Multi Roll, Multi Die",
                value: "MRMD",
            });
        }

        newOptionList.push({
            name: "Die Format: Single: ~d20 | Multi: ~2d20 | Sequence: ~2d20.3d10",
            value: "Info-Option",
        });
    },
};