import markdownParser from "@/components/slatejs/util/markdownParser";
import BadgeElement from "@/components/slatejs/(customElements)/badgeElement";
import DefaultElement from "@/components/slatejs/(customElements)/defaultElement";

export default function MessageRenderer({messageText, players, className}: {
    messageText: string,
    players: Array<any>,
    className?: string
}) {
    let messageArray = markdownParser.toDisplay(messageText, players);
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
            return (
                <BadgeElement element={messageObject}>
                    <ObjectRenderer messageObject={messageObject.children[0]}/>
                </BadgeElement>)

        default:
            return <span>{messageObject.text}</span>
    }
}