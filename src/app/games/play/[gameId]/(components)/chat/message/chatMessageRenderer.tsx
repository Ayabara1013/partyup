import {useMemo} from "react";
import markdownParser from "@/components/slatejs/util/markdownParser";
import BadgeElement from "@/components/slatejs/(customElements)/badgeElement";
import DefaultElement from "@/components/slatejs/(customElements)/defaultElement";
import {PlayerCardTrigger} from "@/app/games/play/[gameId]/(components)/player/playerCard";

export default function ChatMessageRenderer({messageText, players, className}: {
    messageText: string,
    players: Array<any>,
    className?: string
}) {
    const messageArray = useMemo(() => markdownParser.toDisplay(messageText ?? ``, players), [messageText, players]);
    return messageArray.map((item: any, index: number) => {
        return <ObjectRenderer className={className} key={index} messageObject={item}/>
    })
}

function ObjectRenderer({messageObject, className}: { messageObject: any, className?: string }) {
    switch (messageObject.type) {
        case `paragraph`:
            return (
                <DefaultElement className={className}>
                    {messageObject.children.map((obj: any, index: number) => {
                        return (<ObjectRenderer key={index} messageObject={obj}/>)
                    })}
                </DefaultElement>
            )
        case `badge`:
            if (messageObject.featureType === `mention`) {
                // value is "<@userId>"; clicking the pill opens that player's card
                const userId = /^<@([0-9a-f-]{36})>$/i.exec(messageObject.value ?? ``)?.[1];
                return <PlayerCardTrigger userId={userId} className="mention">{messageObject.children[0]?.text}</PlayerCardTrigger>
            }
            return (
                <BadgeElement element={messageObject}>
                    <ObjectRenderer messageObject={messageObject.children[0]}/>
                </BadgeElement>)

        default:
            return <span>{messageObject.text}</span>
    }
}