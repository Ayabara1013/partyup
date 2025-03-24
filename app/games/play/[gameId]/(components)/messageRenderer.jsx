import markdownParser from "@/javascript/slateInput/markdownParser";
import DefaultElement from "@components/slatejs/(customElements)/defaultElement";
import BadgeElement from "@components/slatejs/(customElements)/badgeElement";

export default function MessageRenderer({messageText, players, className}) {
  let messageArray = markdownParser.toDisplay(messageText, players);
  return messageArray.map((item, index) => {
    return <ObjectRenderer className={className} key={index} messageObject={item}/>
  })
}

function ObjectRenderer({messageObject, className}) {
  switch (messageObject.type) {
    case `paragraph`:
      return (
        <DefaultElement className={className}>
          {messageObject.children.map((obj, index) => {
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