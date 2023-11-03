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

  let colors = {
    'command': 'red',
    'callout': 'teal'
  }

  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        backgroundColor: colors[element.featureType] || 'green',
        color: 'white',
        padding: '2px',
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
      return <BadgeComponent {...props}>{children}</BadgeComponent>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const withInlines = editor => {
  const { isInline, isElementReadOnly, isSelectable } = editor

  editor.isInline = element =>
    [ 'link', 'button', 'badge' ].includes(element.type) || isInline(element)

  editor.isElementReadOnly = element =>
    element.type === 'badge' || isElementReadOnly(element)

  editor.isSelectable = element =>
    element.type !== 'badge' && isSelectable(element)

  return editor
}

const editorStyle = {
  maxHeight: '106px',
  padding: '5px',
  overflowX: 'hidden',
  overflowY: 'auto',
}

export {
  withInlines,
  Element,
  editorStyle
}

