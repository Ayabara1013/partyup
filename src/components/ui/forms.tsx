import React, {ReactNode, Ref} from "react";

type InputFieldProps = {
    formClassName?: string,
    labelText?: string,
    labelSubText?: string,
    labelPosition?: string,
    labelClass?: string,

    className?: string,
    placeholder?: string,
    forwardRef?: Ref<any>,
    type?: string,

    buttonText?: string,
    buttonClass?: string,
    onClick?: () => void,
    children?: ReactNode,
    list?: Array<any>,
}


export const Forms = {
    Group: {
        Horizontal: ({columns = 2, children}: { columns: number, children: ReactNode | null }) => {
            return (
                <div className={`w-full grid grid-rows-1 grid-cols-${columns} gap-5`}>
                    {children}
                </div>
            )
        }
    },

    InputField: ({
                     formClassName = '',

                     labelText = '',
                     labelSubText = '',
                     labelPosition = 'top-left',
                     labelClass = 'text-xl',

                     className = 'input-primary w-full',
                     placeholder = '',
                     forwardRef,
                     type = 'text',

                     buttonText = '',
                     buttonClass = '',
                     onClick = () => {
                     },
                     children,
                     list,
                     ...props
                 }: InputFieldProps) => {
        let top = labelPosition.indexOf('top') >= 0
        let bottom = labelPosition.indexOf('bottom') >= 0
        let right = labelPosition.indexOf('right') >= 0
        let front = labelPosition.indexOf('front') >= 0

        let input;
        switch (type) {
            case 'select':
                input =
                    <select ref={forwardRef} {...props}
                            className={`select select-primary ${className}`}>{children}</select>;
                break;
            case 'checkList':
                input = list?.map((item, index) => {
                    return (<input defaultChecked={item.checked} aria-label={item.label} ref={item.ref} key={index}
                                   className={'btn btn-xs rounded-full btn-outline'} type={'checkbox'}/>)
                })
                break;
            case 'checkbox':
                input = <input type={type} ref={forwardRef} {...props}
                               className={`toggle checked:border-primary checked:bg-primary mt-auto mb-auto`}/>
                break;
            case 'textarea':
                input = <textarea ref={forwardRef} placeholder={placeholder} {...props}
                                  className={`textarea textarea-sm textarea- input-bordered ${className}`}/>
                break;
            default:
                input = <input {...{type, placeholder}} {...props} ref={forwardRef}
                               className={`input input-bordered ${className}`}/>;
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

        return (
            <div className={`${formClassName} form-control w-full`}>
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