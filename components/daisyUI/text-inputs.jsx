import '@styles/fonts.scss'

export function DaisyTextInputLabelled({ className = '',formControlClass = '', labelClass = '', labelAltClass = '', topLeft, topRight, bottomLeft, bottomRight,children, placeholder, ...props }) {
  return (
    <label className={`${formControlClass} form-control w-full`}>
      {(topLeft || topRight) &&
        <div className="label">
          {topLeft && <span className={`${labelClass} label-text`}>{topLeft || 'dude'}</span>}
          {topRight && <span className={`${labelAltClass} label-text-alt`}>{topRight || 'fix'}</span>}
        </div>
      }
      <input type="text" placeholder={children || placeholder} className={`input input-bordered ${className} w-full`} />
      {(bottomLeft || bottomRight) &&
        <div className="label">
          {bottomLeft && <span className={`${labelAltClass} label-text-alt`}>{bottomLeft || 'this'}</span>}
          {bottomRight && <span className={`${labelAltClass} label-text-alt`}>{bottomRight || 'please'}</span>}
        </div>
      }
    </label>
  )
}