function ExistingUser({className}) {
  return (
    <div className={`${className} tb1`}>
      <div>you already seem to be a user! do you want to change to a different tier?</div>
    </div>
  )
}

export function CancelAttempt({className}) {
  return (
    <div className={`${className}`}>
      <div>you have selected to cancel your membership to Tavern, are you sure?</div>
      <div>
        <button>yes</button>
        <button>no</button>
      </div>
    </div>
  )
}