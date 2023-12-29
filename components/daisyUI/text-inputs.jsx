import '@styles/fonts.scss'

export function DaisyTextInputLabelled({ className = '', formControlClass = '', labelClass = '', labelAltClass = '', buttonClass = '', preLabelClass = '',
  topLeft, topRight, bottomLeft, bottomRight,
  button, preLabel,
  children, placeholder, ...props }) {
  return (
    <label className={`${formControlClass} form-control w-full`}>
      {(topLeft || topRight) &&
        <div className="label">
          {topLeft && <span className={`${labelClass} label-text`}>{topLeft || 'dude'}</span>}
          {topRight && <span className={`${labelAltClass} label-text-alt`}>{topRight || 'fix'}</span>}
        </div>
      }

      <div className='flex gap-2'>
        {preLabel && <div className={`m-auto whitespace-nowrap capitalize ${preLabelClass}`}>
          {preLabel}
        </div>}

        <input type="text" placeholder={children || placeholder} className={`input input-bordered ${className} w-full`} />

        {button && <button className={`btn ${buttonClass}`}>{button}</button>}
      </div>

      {(bottomLeft || bottomRight) &&
        <div className="label">
          {bottomLeft && <span className={`${labelAltClass} label-text-alt`}>{bottomLeft || 'this'}</span>}
          {bottomRight && <span className={`${labelAltClass} label-text-alt`}>{bottomRight || 'please'}</span>}
        </div>
      }
    </label>
  )
}