import '@/styles/blocks.scss';

import type {ButtonHTMLAttributes, HTMLAttributes, MouseEventHandler, ReactNode} from 'react';

type SectionProps = HTMLAttributes<HTMLDivElement> & {
    id?: string;
    className?: string;
    header?: ReactNode;
    children?: ReactNode;
};

type HeaderProps = HTMLAttributes<HTMLHeadingElement> & {
    className?: string;
    children?: ReactNode;
    title?: ReactNode;
};

type TextBlockProps = HTMLAttributes<HTMLDivElement> & {
    className?: string;
    children?: ReactNode;
};

type SearchFilterProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> & {
    className?: string;
    list?: boolean;
    children?: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
};

export const Blocks = {
    Section: function ({id, className = '', header, children, ...props}: SectionProps) {
        const isRow = className.includes('flex-row');
        return (
            <div id={id} className={`${className} flex ${!isRow ? 'flex-col' : ''} b1 gap-3`}{...props}>
                {children}
            </div>
        );
    },

    Header: function ({className = '', children, title, ...props}: HeaderProps) {
        const sizes = [
            'text-sm',
            'text-md',
            'text-lg',
            'text-xl',
            'text-2xl',
            'text-3xl',
            'text-4xl',
            'text-5xl',
            'text-6xl',
            'text-7xl',
            'text-8xl',
        ];

        const hasSize = sizes.some((size) =>
            className.includes(size)
        );

        return (
            <h1 className={`${className} ${!hasSize ? 'text-3xl' : ''} text-center font-bold`}{...props}>
                {children || title}
            </h1>
        );
    },

    TextBlock: function ({className = '', children, ...props}: TextBlockProps) {
        return (
            <div className={`${className} b2`}{...props}>
                {children}
            </div>
        );
    },

    // search elements -----------------------------------------------------------
    SearchFilter: function ({className = '', list = true, children, onClick, ...props}: SearchFilterProps) {
        const sizes = [
            'btn-xs',
            'btn-sm',
            'btn-md',
            'btn-lg',
            'btn-wide',
            'btn-block',
            'btn-circle',
            'btn-square',
        ];

        const variants = [
            'btn-primary',
            'btn-secondary',
            'btn-ghost',
            'btn-link',
            'btn-error',
            'btn-warning',
            'btn-success',
            'btn-info',
        ];

        const hasSize = sizes.some((size) =>
            className.includes(size)
        );

        const hasVariant = variants.some((variant) =>
            className.includes(variant)
        );

        const FilterButton = () => (
            <button type="button"
                    className={`btn ${className} ${!hasVariant ? 'btn-primary' : ''} ${!hasSize ? 'btn-sm' : ''}`}
                    onClick={onClick}{...props}>
                {children}
            </button>
        );

        return list ? (
            <li>
                <FilterButton/>
            </li>
        ) : (
            <FilterButton/>
        );
    },

    // ---------------------------------------------------------------------------
};