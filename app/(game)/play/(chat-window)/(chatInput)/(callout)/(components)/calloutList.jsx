import MemberCallout from "@/app/(game)/play/(chat-window)/(chatInput)/(callout)/(components)/calloutItem";

//Callout list component. Takes in a list of members and generates a list of callouts.
export default function CalloutList({ memberList, className, id, calloutOnClick, highlightStyle, ...props }) {
  let elementList = [];
  for (let i = 0; i < memberList.length; i++) {
    let member = memberList[i];
    let selectedClasses = (i === 0) ? highlightStyle : '';
    let customProps = {
      className: selectedClasses,
      member: member,
      id: id + i,
      onClick: calloutOnClick
    }
    elementList.push(
      <MemberCallout key={id + i} value={i} {...customProps}/>
    )
  }

  return ((memberList.length > 0) &&
    <div className={`w-full absolute border z-50 ${className}`} id={id} {...props}>{elementList}</div>
  )
}