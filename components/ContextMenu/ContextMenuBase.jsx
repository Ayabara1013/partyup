export default function ContextMenuBase({ style, children }) {
  return (
    <ul className={ `menu bg-base-200 w-56 rounded-box absolute z-40` } style={ style }>
      { children }
    </ul>
  )
}