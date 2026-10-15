import {memo} from "react";

export type ChatOption = {
    name: string;
    value: string;
};

type ChatOptionHeaderProps = {
    title: string;
    list: ChatOption[];
    highlightIndex: number;
    onSelect: (index: number) => void;
};

// Mention / command suggestions shown above the chat input.
function ChatOptionHeader({title, list, highlightIndex, onSelect}: ChatOptionHeaderProps) {
    if (list.length === 0) return null;

    return (
        <div className="chat-options" role="listbox">
            {title && <div className="chat-options__title">{title}</div>}
            {list.map((item, i) =>
                <button key={`${item.value}-${i}`} role="option" aria-selected={i === highlightIndex}
                    className={`chat-options__item ${i === highlightIndex ? `chat-options__item--active` : ``}`}
                    // Keep focus in the editor while clicking an option
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => onSelect(i)}>
                    {item.name}
                </button>
            )}
        </div>
    );
}

export default memo(ChatOptionHeader);
