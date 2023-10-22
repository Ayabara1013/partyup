export default function ContextMenuBase({ style, menuOptions }) {
  return (
    <ul className={ `menu bg-base-200 w-56 rounded-box absolute z-40` } style={ style }>
      { menuOptions }
    </ul>
  )
}