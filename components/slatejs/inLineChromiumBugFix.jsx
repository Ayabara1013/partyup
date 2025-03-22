import React from "react";

export default function InlineChromiumBugfix() {
  return (
    <span contentEditable={false} className={{fontSize: '0'}}>
    {String.fromCodePoint(160) /* Non-breaking space */}
  </span>
  )
}