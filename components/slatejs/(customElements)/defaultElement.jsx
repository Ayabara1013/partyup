export default function DefaultElement(props) {
  return (
    <div className={`relative ${props.className}`} {...props.attributes}>
      {props.children}
    </div>
  )
}