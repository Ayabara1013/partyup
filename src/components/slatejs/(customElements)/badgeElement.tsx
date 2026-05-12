import {useSelected} from "slate-react";
import React, {ReactNode} from "react";
import InlineChromiumBugfix from "@/components/slatejs/util/inLineChromiumBugFix";
import {BadgeElementData} from "@/components/slatejs/util/slateTypes";


export default function BadgeElement({attributes, children, element}: {
    attributes?: any,
    children: ReactNode,
    element: BadgeElementData
}) {
    const selected = useSelected();
    const colors: Record<string, string> = {
        command: "blue",
        mention: "teal",
    };

    return (
        <span{...attributes} contentEditable={false}
             style={{
                 backgroundColor: colors[element.featureType  ?? ""] ?? 'red',
                 color: 'white',
                 padding: '2px',
                 borderRadius: '2px',
                 fontSize: '0.9em',
             }}
             data-playwright-selected={selected}>
      <InlineChromiumBugfix/>
            {children}
    </span>
    )
}