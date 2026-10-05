import React, {ChangeEventHandler, MouseEventHandler, ReactNode, Ref,} from 'react';

type HorizontalProps = {
    columns?: number;
    children: ReactNode;
};

type CheckListItem = {
    checked?: boolean;
    label: string;
    ref?: Ref<HTMLInputElement>;
};

type InputFieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'select'
    | 'checkList'
    | 'checkbox'
    | 'textarea'
    | string;

type InputFieldProps = {
    formClassName?: string;

    labelText?: string;
    labelSubText?: string;
    labelPosition?: string;
    labelClass?: string;

    className?: string;
    placeholder?: string;
    forwardRef?:
        | Ref<HTMLInputElement>
        | Ref<HTMLSelectElement>
        | Ref<HTMLTextAreaElement>;
    type?: InputFieldType;

    buttonText?: string;
    buttonClass?: string;
    onClick?: MouseEventHandler<HTMLButtonElement>;

    children?: ReactNode;
    list?: CheckListItem[];
} & React.HTMLAttributes<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;

export const Forms = {
    Group: {
        Horizontal: ({columns = 2, children,}: HorizontalProps): React.ReactElement => {
            return (
                <div className={`w-full grid grid-rows-1 grid-cols-${columns} gap-5`}>
                    {children}
                </div>
            );
        },
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
                     list = [],
                     ...props
                 }: InputFieldProps): React.ReactElement => {
        const top = labelPosition.includes('top');
        const bottom = labelPosition.includes('bottom');
        const right = labelPosition.includes('right');
        const front = labelPosition.includes('front');

        let input: ReactNode;
        switch (type) {
            case 'select':
                input = (
                    <select ref={forwardRef as Ref<HTMLSelectElement>}{...props}
                            className={`select select-primary ${className}`}>
                        {children}
                    </select>
                );
                break;

            case 'checkList':
                input = list.map((item, index) => (
                    <input defaultChecked={item.checked} aria-label={item.label} ref={item.ref} key={index}
                           className="btn btn-xs rounded-full btn-outline" type="checkbox"/>
                ));
                break;

            case 'checkbox':
                input = (
                    <input type="checkbox" ref={forwardRef as Ref<HTMLInputElement>}{...props}
                           className="toggle checked:border-primary checked:bg-primary mt-auto mb-auto"/>
                );
                break;

            case 'textarea':
                input = (
                    <textarea ref={forwardRef as Ref<HTMLTextAreaElement>} placeholder={placeholder}{...props}
                              className={`textarea textarea-sm textarea-bordered ${className}`}/>
                );
                break;

            default:
                input = (
                    <input type={type} placeholder={placeholder}{...props} ref={forwardRef as Ref<HTMLInputElement>}
                           className={`input input-bordered ${className}`}/>
                );
        }

        const label = front ? (
            <div className={`m-auto whitespace-nowrap capitalize ${labelClass}`}>
                {labelText}
                {labelSubText && (
                    <span className="opacity-50"> {labelSubText}</span>
                )}
            </div>
        ) : (
            <div className="label">
                <span className={`label-text${right ? '-alt' : ''} ${labelClass}`}>
                    {labelText}
                    {labelSubText && (
                        <span className="opacity-50"> {labelSubText}</span>
                    )}
                </span>
            </div>
        );

        return (
            <div className={`${formClassName} form-control w-full`}>
                {top && label}
                <div className="flex gap-4">
                    {front && label}
                    {input}
                    {buttonText && (
                        <button type="button" className={`btn ${buttonClass}`} onClick={onClick}>
                            {buttonText}
                        </button>
                    )}
                </div>
                {bottom && label}
            </div>
        );
    },
};