




export default function Subscription(props) {
  return (
    <div className={`${className}`}>
      { fc.isUser ? <ExistingUser /> : <NewUser /> }
    </div>
  )
}



function NewUser({ className }) {
  return (
    <div className={`${className}`}>

    </div>
  )
}

function ExistingUser({ className }) {
  return (
    <div className={`${className}`}>

    </div>
  )
}