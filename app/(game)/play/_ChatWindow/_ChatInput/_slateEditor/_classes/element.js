import React from "react";
import { useSelected } from "slate-react";

const InlineChromiumBugfix = () => (
  <span
    contentEditable={false}
    className={{ fontSize: '0' }}
  >
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
)
const BadgeComponent = ({ attributes, children, element }) => {
  const selected = useSelected()

  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        backgroundColor: 'green',
        color: 'white',
        padding: '2px 6px',
        borderRadius: '2px',
        fontSize: '0.9em',
      }}
      data-playwright-selected={selected}
    >
      <InlineChromiumBugfix/>
      {children}
    </span>
  )
}
const Element = props => {
  const { attributes, children, element } = props
  switch (element.type) {
    case 'badge':
      return <BadgeComponent {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

export { Element }