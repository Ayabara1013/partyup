import {ReactNode} from "react";

type FieldProps = {
    label: string;
    hint?: string;
    error?: string;
    optional?: boolean;
    className?: string;
    children: ReactNode;
};

// Labelled form field using the shared .field styles (globals.scss): label, control, then an error or hint
export default function Field({label, hint, error, optional, className, children}: FieldProps) {
    return (
        <label className={`field ${className ?? ``}`}>
            <span className="field__label">{label}{optional && <span className="field__optional">optional</span>}</span>
            {children}
            {error ? <span className="field__error">{error}</span> : hint && <span className="panel__hint">{hint}</span>}
        </label>
    );
}
