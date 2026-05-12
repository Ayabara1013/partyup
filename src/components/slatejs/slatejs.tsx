import React, {KeyboardEvent, useMemo} from "react";
import {createEditor, Descendant, BaseEditor, Element as SlateElement} from "slate";
import {Editable, ReactEditor, RenderElementProps, Slate, withReact} from "slate-react";

import ElementRenderer from "@/components/slatejs/elementRenderer";
import {editorStyle} from "@/components/slatejs/util/editorSettings";
import {editorDefault} from "@/components/slatejs/util/editorDefaultValues";

type CustomElement = {
    type: string;
    children: Descendant[];
};

type CustomEditor = BaseEditor & ReactEditor;

function useCustomEditorHook() {
    const withInlines = (editor: CustomEditor): CustomEditor => {
        const {isInline, isElementReadOnly, isSelectable} = editor;

        editor.isInline = (element: SlateElement) =>
            ["link", "button", "badge"].includes((element as CustomElement).type) ||
            isInline(element);

        editor.isElementReadOnly = (element: SlateElement) =>
            (element as CustomElement).type === "badge" ||
            isElementReadOnly(element);

        editor.isSelectable = (element: SlateElement) =>
            (element as CustomElement).type !== "badge" &&
            isSelectable(element);

        return editor;
    };

    const editor = useMemo(
        () => withInlines(withReact(createEditor()) as CustomEditor),
        []
    );

    return {editor};
}

type CustomSlateProps = {
    editor: CustomEditor;
    initialValue?: Descendant[];
    readOnly?: boolean;
    onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
    onKeyUp?: (event: KeyboardEvent<HTMLDivElement>) => void;
    className?: string;
};

const cloneDefaultValue = () =>
    structuredClone(editorDefault.value.default);

function CustomSlate({
                         editor,
                         initialValue = cloneDefaultValue(),
                         readOnly,
                         onKeyDown,
                         onKeyUp,
                         className,
                     }: CustomSlateProps) {
    return (
        <Slate editor={editor} initialValue={initialValue}>
            <Editable
                renderElement={(innerProps) => (
                    <ElementRenderer {...innerProps} />
                )}
                className={className}
                readOnly={readOnly}
                placeholder={!readOnly ? "Enter some text..." : undefined}
                style={!readOnly ? editorStyle : undefined}
                onKeyDown={!readOnly ? onKeyDown : undefined}
                onKeyUp={!readOnly ? onKeyUp : undefined}
            />
        </Slate>
    );
}

export {useCustomEditorHook, CustomSlate};