import ChatOptionListItem from "@/app/(game)/play/(chat-window)/(chatInput)/(chatOptions)/chatOptionListItem";

export default function ChatOptionList({ list, className, id, itemOnClick, highlightStyle, ...props }) {
  if (!list) return null;
  let elementList = [];
  for (let i = 0; i < list.length; i++) {
    let { name } = list[i];
    let selectedClasses = (i === 0) ? highlightStyle : '';
    let customProps = {
      name,
      id: id + i,
      onClick: itemOnClick,
      className: selectedClasses,
    }
    elementList.push(<ChatOptionListItem key={id + i} value={i} {...customProps}/>)
  }

  return ((list.length > 0) &&
    <div className={`w-full absolute border z-50 ${className}`} id={id} {...props}>{elementList}</div>
  )
}