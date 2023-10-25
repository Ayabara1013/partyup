export default function EditFormInput({ title, type, ...props }) {
  switch (type) {
    case 'players': {
      return (
        <div className="center w-full">
          <div className="form-control w-10/12">
            <label className="label">
              <span className="label-text">{title}</span>
            </label>
            <select className="select select-bordered" {...props}>
              <option value="1">1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
              <option value='6'>6</option>
            </select>
          </div>
        </div>
      )
    }
    default:
      return (
        <div className="center w-full">
          <div className="form-control w-10/12">
            <label className="label">
              <span className="label-text">{title}</span>
            </label>
            <input type="text" placeholder="Type here" className="input input-bordered w-full" {...props}/>
          </div>
        </div>
      )
  }
}