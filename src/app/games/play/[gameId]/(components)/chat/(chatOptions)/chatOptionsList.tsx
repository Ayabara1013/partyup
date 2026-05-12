import React, {forwardRef, RefObject} from "react";

type ChatOption = {
    name: string;
    value: string;
};

type ChatOptionListProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> & {
    chatOptionsRefs: {
        mainRef: React.RefObject<HTMLDivElement | null>;
        optionRefs: React.RefObject<HTMLButtonElement | null>[];
    };
    list: ChatOption[];
    highlightStyle: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

export default function ChatOptionList({
                                           chatOptionsRefs,
                                           list,
                                           onClick,
                                           highlightStyle = '',
                                           ...props
                                       }: ChatOptionListProps) {
    if (!list) return null;

    const elementList = [];

    for (let i = 0; i < 9; i++) {
        elementList.push(
            <ChatOptionListItem
                ref={chatOptionsRefs.optionRefs[i]}
                key={i}
                value={i}
                item={list[i]}
                onClick={onClick}
                className={i === 0 ? highlightStyle : ""}
            />
        );
    }

    return (
        list.length > 0 && (
            <div
                className="pseudo-input input-primary grid grid-cols-1 gap-y-2 absolute z-50 p-3"
                {...props}
            >
                {elementList}
            </div>
        )
    );
}

type ChatOptionListItemProps =
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
    item?: ChatOption;
    className?: string;
};

const ChatOptionListItem = forwardRef<
    HTMLButtonElement,
    ChatOptionListItemProps
>(function ChatOptionListItem({item, className = "", ...props}, ref) {
    const additionalClasses = !item
        ? " hidden"
        : item.value === "Info-Option"
            ? " info-option"
            : "";

    return (
        <button
            ref={ref}
            className={`w-full text-left pseudo-input ${className}${additionalClasses}`}
            {...props}
        >
            {item?.name}
        </button>
    );
});