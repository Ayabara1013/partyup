import {ReactNode} from "react";
import {RenderElementProps, useSelected} from "slate-react";
import InlineChromiumBugfix from "@/components/slatejs/util/inLineChromiumBugFix";
import {BadgeElementData} from "@/components/slatejs/util/slateTypes";

// Class per badge type (styles in globals.scss). Mentions use the shared Discord-style pill.
const BADGE_CLASSES: Record<string, string> = {
    mention: `mention`,
    command: `slate-badge slate-badge--command`,
    dice: `slate-badge slate-badge--dice`,
};

type BadgeElementProps = {
    attributes?: RenderElementProps[`attributes`];
    children: ReactNode;
    element: BadgeElementData;
};

export default function BadgeElement({attributes, children, element}: BadgeElementProps) {
    const selected = useSelected();
    const className = BADGE_CLASSES[element.featureType ?? ``] ?? `slate-badge`;

    return (
        <span {...attributes} contentEditable={false} className={selected ? `${className} is-selected` : className}>
            <InlineChromiumBugfix/>
            {children}
            <InlineChromiumBugfix/>
        </span>
    );
}
