import { BaseEditor, Descendant } from "slate";
import { ReactEditor } from "slate-react";

export type BadgeElementData = {
    type: "badge";
    featureType?: string;
    label?: string;
    children: Descendant[];
};

export type DefaultElementData = {
    type: "paragraph";
    children: Descendant[];
};

export type CustomElement = BadgeElementData | DefaultElementData;

export type CustomText = {
    text: string;
};

declare module "slate" {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}