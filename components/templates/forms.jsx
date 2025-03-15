export const Forms = {
  /**
   * Form Input
   * @param {string} formControlClass Encapsulating Form block CSS.
   *
   * Labels
   * @param {string} labelPosition Label position. Options: top-left, top-right, bottom-left, bottom-right, front.
   * @param {string} labelText Label text.
   * @param {string} subLabelText subLabel text, faded. Like a side note.
   * @param {string} labelClass Label CSS classes.
   *
   * Input (and it's basic types)
   * @param {string} placeholder Input placeholder.
   * @param {string} className Input CSS classes.
   * @param {Object} forwardRef react ref to reference the html.
   * @param {string} type Input type.
   * @param {Object} props Additional parameters for input.
   *
   * Additional button for input
   * @param {string} buttonText Button text.
   * @param {string} buttonClass Button CSS classes.
   * @param {function} onClick Button on click function.
   *
   * Select
   * @param {array} children When using select, uses children to propagate options.
   *
   * CheckList (Custom style)
   * @param {array} list A list of objects that contain checkbox names and forwardRefs
   *
   */
  DefaultInputField: ({
                        formControlClass = '',

                        labelText = '',
                        labelSubText = '',
                        labelPosition = 'top-left',
                        labelClass = 'text-xl',

                        className = 'input-primary',
                        placeholder = '',
                        forwardRef,
                        type = 'text',

                        buttonText,
                        buttonClass = '',
                        onClick = () => {
                        },
                        children,
                        list,
                        ...props
                      }) => {
    let top = labelPosition.indexOf('top') >= 0
    let bottom = labelPosition.indexOf('bottom') >= 0
    let right = labelPosition.indexOf('right') >= 0
    let front = labelPosition.indexOf('front') >= 0

    let input;
    switch (type) {
      case 'select':
        input = <select ref={forwardRef} {...props} className={`select select-primary w-full`}>{children}</select>;
        break;
      case 'checkList':
        input =
          list.map((item, index) => {
            return (<input defaultChecked={item.checked} aria-label={item.label} ref={item.ref} key={index}
                           className={'btn btn-xs rounded-full btn-outline'} type={'checkbox'}/>)
          })
        break;
      case 'checkbox':
        input =
          <>
            <input type={type} ref={forwardRef} {...props}
                   className={`toggle checked:border-primary checked:bg-primary mt-auto mb-auto`}/>
            <label className={`whitespace-nowrap ${labelClass}`}>
              {labelText} {labelSubText && <span className="opacity-50"> {labelSubText}</span>}
            </label>
          </>
        break;
      case 'textarea':
        input = <textarea ref={forwardRef} placeholder={placeholder} {...props}
                          className={`textarea textarea-sm textarea- input-bordered ${className} w-full`}/>
        break;
      default:
        input = <input {...{type, placeholder}} {...props} ref={forwardRef}
                       className={`input input-bordered ${className} w-full`}/>;
    }

    let label = front
      ? <div className={`m-auto whitespace-nowrap capitalize ${labelClass}`}>
        {labelText}
        {labelSubText && <span className="opacity-50"> {labelSubText}</span>}
      </div>
      : <div className="label">
        <span className={`label-text${right && '-alt'} ${labelClass}`}>
          {labelText}
          {labelSubText && <span className="opacity-50"> {labelSubText}</span>}
        </span>
      </div>;
    if (type === 'checkbox') {
      label = <></>;
    }

    return (
      <div className={`${formControlClass} form-control w-full`}>
        {top && label}

        <div className='flex gap-4'>
          {front && label}
          {input}
          {buttonText && <button className={`btn ${buttonClass}`} onClick={onClick}>{buttonText}</button>}
        </div>

        {bottom && label}
      </div>)
  }
}