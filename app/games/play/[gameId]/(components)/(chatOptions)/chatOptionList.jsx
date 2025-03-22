export default function ChatOptionList({chatOptionsRefs, list, onClick, highlightStyle, ...props}) {
  if (!list) return null;
  let elementList = [];
  for (let i = 0; i < 9; i++) {
    let customProps = {
      item: list[i],
      onClick: onClick,
      className: (i === 0) ? highlightStyle : '',
    }
    elementList.push(<ChatOptionListItem ref={chatOptionsRefs.optionRefs[i]} key={i} value={i} {...customProps}/>)
  }
  return ((list.length > 0) &&
    <div
      className={`pseudo-input input-primary grid grid-cols-1 gap-y-2 absolute z-50 p-3`}{...props}>{elementList}</div>
  )
}

// Command item component. Takes a command object and renders a button with the command name.
function ChatOptionListItem({item, className, ...props}) {
  let additionalClasses = !item ? ` hidden` : (item.value === `Info-Option`) ? ` info-option` : ``;
  return (
    <button
      className={`w-full text-left pseudo-input ${className + additionalClasses}`} {...props}>{item?.name}</button>
  )
}