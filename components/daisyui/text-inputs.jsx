import '@styles/fonts.scss'

export function DaisyTextInputLabelled({
                                         className = '',
                                         formControlClass = '',
                                         labelClass = '',
                                         labelAltClass = '',
                                         buttonClass = '',
                                         preLabelClass = '',
                                         topLeft,
                                         topRight,
                                         bottomLeft,
                                         bottomRight,
                                         button,
                                         preLabel,
                                         children,
                                         placeholder,
                                         ...props
                                       }) {
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

        <input type="text" placeholder={children || placeholder}
               className={`input input-bordered ${className} w-full`}/>

        {button && <button className={`btn ${buttonClass}`}>{button}</button>}
      </div>

      {(bottomLeft || bottomRight) &&
        <div className="label">
          {bottomLeft && <span className={`${labelAltClass} label-text-alt`}>{bottomLeft || 'this'}</span>}
          {bottomRight &&
            <span className={`${labelAltClass} label-text-alt`}>{bottomRight || 'please'}</span>}
        </div>
      }
    </label>
  )
}

/**
 * DaisyTextInputLabelled2
 * @param {string} formControlClass Encapsulating Form block CSS.
 *
 * @param {string} labelPosition Label position. Options: top-left, top-right, bottom-left, bottom-right, front.
 * @param {string} labelText Label text.
 * @param {string} labelText Label text.
 * @param {string} labelClass Label CSS classes.
 *
 * @param {string} placeholder Input placeholder.
 * @param {string} className Input CSS classes.
 * @param {Object} forwardRef react ref to reference the html.
 * @param {string} type Input type.
 * @param {Object} props Additional parameters for input.
 *
 * @param {string} buttonText Button text.
 * @param {string} buttonClass Button CSS classes.
 * @param {function} onClick Button on click function.
 */

export function DaisyTextInputLabelled2({
                                          formControlClass = '',

                                          labelText = '',
                                          labelSubText,
                                          labelPosition = 'top-right',
                                          labelClass = '',

                                          className = '',
                                          placeholder = '',
                                          forwardRef,
                                          type = 'text',

                                          buttonText,
                                          buttonClass = '',
                                          onClick = () => {
                                          },
                                          children,
                                          ...props
                                        }) {
  let top = labelPosition.indexOf('top') >= 0
  let bottom = labelPosition.indexOf('bottom') >= 0
  let right = labelPosition.indexOf('right') >= 0
  let front = labelPosition.indexOf('front') >= 0

  let label = front
    ?
    <div className={`m-auto whitespace-nowrap capitalize ${labelClass}`}>{labelText}</div>
    :
    <div className="label">
      <span className={`label-text${right && '-alt'} ${labelClass}`}>
        {labelText}
        {labelSubText && <span className="opacity-50">(not including yourself)</span>}</span>
    </div>;

  return (
    <label className={`${formControlClass} form-control w-full`}>
      {top && label}

      <div className='flex gap-2'>
        {front && label}
        {type !== 'select'
          ?
          <input className={`input input-bordered ${className} w-full`} type={type} placeholder={placeholder}
                 ref={forwardRef} {...props}/>
          : <select className={``} ref={forwardRef}>
            {children}
          </select>}

        {buttonText && <button className={`btn ${buttonClass}`} onClick={onClick}>{buttonText}</button>}
      </div>

      {bottom && label}
    </label>
  )
}

