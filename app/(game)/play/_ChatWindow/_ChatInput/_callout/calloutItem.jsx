// Callout item component. Takes in a member and generates a div.
export default function MemberCallout({ member, className, ...props }) {
  return (
    <div className={`w-full ${className}`} {...props}>
      {member.name}
    </div>
  )
}