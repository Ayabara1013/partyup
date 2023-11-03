// Command item component. Takes a command object and renders a button with the command name.
export default function ChatOptionListItem({ name, className, ...props }) {
  return (
    <button className={`w-full p-0.5 text-left ${className}`} {...props}>
      {name}
    </button>
  )
}