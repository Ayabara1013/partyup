import React, {ReactNode} from "react";
import {DefaultElementData} from "@/components/slatejs/util/slateTypes";

type DefaultElementProps = {
    attributes?: React.HTMLAttributes<HTMLDivElement>;
    children: ReactNode;
    element?: DefaultElementData;
    className?: string;
};

export default function DefaultElement({
                                           attributes,
                                           children,
                                           className,
                                       }: DefaultElementProps) {
    return (
        <div className={`relative ${className ?? ""}`} {...attributes}>
            {children}
        </div>
    );
}