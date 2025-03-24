import React from "react";
import BadgeElement from "@components/slatejs/(customElements)/badgeElement";
import DefaultElement from "@components/slatejs/(customElements)/defaultElement";

export default function ElementRenderer(props) {
  const {children, element} = props
  switch (element.type) {
    case 'badge':
      return <BadgeElement {...props}>{children}</BadgeElement>
    default:
      return <DefaultElement {...props}>{children}</DefaultElement>
  }
}
