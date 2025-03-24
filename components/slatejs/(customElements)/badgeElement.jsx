import {useSelected} from "slate-react";
import React from "react";
import InlineChromiumBugfix from "@components/slatejs/inLineChromiumBugFix";

export default function BadgeElement({attributes, children, element}) {
  const selected = useSelected();
  let colors = {
    'command': 'blue',
    'mention': 'teal'
  }

  return (
    <span{...attributes} contentEditable={false}
         style={{
           backgroundColor: colors[element.featureType] || 'red',
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