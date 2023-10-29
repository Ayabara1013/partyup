const withInlines = editor => {
  const { insertData, insertText, isInline, isElementReadOnly, isSelectable } = editor

  editor.isInline = element =>
    [ 'link', 'button', 'badge' ].includes(element.type) || isInline(element)

  editor.isElementReadOnly = element =>
    element.type === 'badge' || isElementReadOnly(element)

  editor.isSelectable = element =>
    element.type !== 'badge' && isSelectable(element)

  return editor
}

export { withInlines }

