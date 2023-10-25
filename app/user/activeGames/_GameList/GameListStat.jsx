export default function GameStat({ title, values, children }) {
  return (
    <div className="stat">
      {title && <div className="stat-title">{title}</div>}
      {values && values.map(text => <div className="stat-desc font-medium" key={text}>{text}</div>)}
      {children}
    </div>
  )
}