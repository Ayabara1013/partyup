import MemberCallout from "@/app/(game)/play/_ChatWindow/_ChatInput/_callout/calloutItem";

//Callout list component. Takes in a list of members and generates a list of callouts.
export default function CalloutList({ memberList, id, ...props }) {
  let elementList = [];
  for (let i = 0; i < memberList.length; i++) {
    let member = memberList[i];
    let classes = (i === 0) ? 'border' : '';
    elementList.push(<MemberCallout className={classes} member={member} key={id + i} id={id + i}/>)
  }

  return (
    <div className={`w-full border absolute`} id={id} {...props}>
      {elementList}
    </div>
  )
}