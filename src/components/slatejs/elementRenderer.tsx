import React from "react";
import { RenderElementProps } from "slate-react";
import BadgeElement from "@/components/slatejs/(customElements)/badgeElement";
import DefaultElement from "@/components/slatejs/(customElements)/defaultElement";
import {BadgeElementData} from "@/components/slatejs/util/slateTypes";

export default function ElementRenderer(props: RenderElementProps) {
    const { attributes, children, element } = props;

    switch (element.type) {
        case "badge":
            return (
                <BadgeElement
                    attributes={attributes}
                    element={element as BadgeElementData}
                >
                    {children}
                </BadgeElement>
            );

        default:
            return (
                <DefaultElement
                    attributes={attributes}
                    element={element}
                >
                    {children}
                </DefaultElement>
            );
    }
}