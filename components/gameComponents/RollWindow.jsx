export function RollWindow(props) {
  // const { item } = props;

  return (
    <div className={`flex flex-col p-2 gap-2 h-full w-full bg-neutral rounded-xl`}>
      <div className='box flex-1 rounded-xl'>message window</div>
      <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full" />
    </div>
  )
}