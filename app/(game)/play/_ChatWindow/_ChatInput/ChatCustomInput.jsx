'use client'
import React from "react";
import { useEffect, useState } from "react";

import CalloutList from "@/app/(game)/play/_ChatWindow/_ChatInput/_callout/calloutList";
import SlateEditor from "@/app/(game)/play/_ChatWindow/_ChatInput/_slateEditor/slateEditor";


export default function ChatCustomInput({ id }) {

  const [ memberList, setMemberList ] = useState([]);
  const [ calloutFragment, setCalloutFragment ] = useState('');
  const [ calloutHighlightIndex, setCalloutHighlightIndex ] = useState(0);

  let textarea = document.getElementById(id + '123');
  let dimensionsTA = textarea?.getBoundingClientRect();
  let windowDimensions = window.innerHeight;
  let style = {
    ...textarea && {
      bottom: windowDimensions - (dimensionsTA.y + dimensionsTA.bottom) / 2,
      left: dimensionsTA.x,
      width: dimensionsTA.width
    }
  }

  //Code to show callout selection popup
  useEffect(() => {
    if (memberList.length > 0) {
      for (let i in memberList) {
        document.getElementById(id + '321' + i).classList.remove('border');
      }
      document.getElementById(id + '321' + calloutHighlightIndex).classList.add('border');
    }
  }, [ calloutHighlightIndex ])

  const calloutUpdate = (callout) => {
    setCalloutFragment(callout ? callout.callout : '');
    setMemberList(callout ? callout.memberList : []);
  }

  const calloutKeyDown = (e) => {
    let validKeys = [ 'ArrowDown', 'ArrowUp' ];
    if (memberList) {
      let key = e.key;
      let max = memberList.length;

      if (validKeys.includes(key) && max > 0) {
        let newIndex = calloutHighlightIndex + (key === 'ArrowDown' ? 1 : -1);
        setCalloutHighlightIndex(newIndex < 0 ? max - 1 : newIndex % max);
        e.preventDefault();
      }
      if (key === 'Enter') {
        let text = textarea.value;
        text = text.replace(calloutFragment, `@{${memberList[calloutHighlightIndex].name}}`);
        textarea.value = text;
        setCalloutFragment('');
        setMemberList([]);
        setCalloutHighlightIndex(0);
        e.preventDefault();
      }
    }
  }

  return (
    <div className="w-full">
      <CalloutList memberList={memberList} style={style} id={id + '321'}/>
      <SlateEditor
        // calloutKeyDown={calloutKeyDown} calloutUpdate={calloutUpdate}
      />
    </div>
  )
}
