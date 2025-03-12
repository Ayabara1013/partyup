import {useContextMenu} from "@app/(contexts)/contextMenu";

export default function ContextMenuBase() {
    const {contextMenu} = useContextMenu()
    return (
        contextMenu.clicked &&
        <ul className={`menu bg-base-200 w-56 rounded-box absolute z-40`} style={contextMenu.style}>
            {contextMenu.options}
        </ul>
    )
}