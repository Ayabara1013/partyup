// Callout item component. Takes in a member and generates a div.
export default function MemberCallout({ member, className, ...props }) {
  return (
    <button className={`w-full p-0.5 text-left ${className}`} {...props}>
      {member.name}
    </button>
  )
}