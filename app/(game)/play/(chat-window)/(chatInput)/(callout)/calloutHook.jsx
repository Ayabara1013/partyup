import { useEffect, useState } from "react";
import { isKeyHotkey } from "is-hotkey";
import { Transforms } from "slate";
import { editorFix } from "@/components/slatejs/(util)/editorUtil";
import { ReactEditor } from "slate-react";

function addToList(member, list) {
  if (!list.includes(member)) {
    list.push(member);
  }
}

const useCallout = (id) => {
  const [ memberList, setMemberList ] = useState([]);
  const [ calloutFragment, setCalloutFragment ] = useState('');
  const [ calloutHighlightIndex, setCalloutHighlightIndex ] = useState(0);
  const highlightStyle = 'bg-blue-200';

  //Code to show callout selection popup
  useEffect(() => {
    let classes = highlightStyle.split(' ');
    if (memberList.length > 0) {
      for (let i in memberList) {
        for (let className of classes) {
          document.getElementById(id + 'callout' + i).classList.remove(className);
        }
      }
      for (let className of classes) {
        document.getElementById(id + 'callout' + calloutHighlightIndex).classList.add(className);
      }
    }
  }, [ calloutHighlightIndex ])

  const updateCalloutUi = (word, activePlayers) => {
    let fragment = undefined;
    let newMemberList = [];
    const unFinishedCallout = /@(?![{ ])/;

    if (unFinishedCallout.test(word)) {
      fragment = word;
      let formattedWord = word.toLowerCase().replace('@', '');
      for (let member of activePlayers) {
        let { name, characterName } = member;
        name = name.toLowerCase();
        characterName = characterName.toLowerCase();

        if (name.includes(formattedWord)) {
          addToList(member, newMemberList);
        } else if (characterName.includes(formattedWord)) {
          addToList(member, newMemberList);
        } else {
          for (let alias of member.callouts) {
            if (alias.toLowerCase().includes(formattedWord)) {
              addToList(member, newMemberList);
              break;
            }
          }
        }
      }
    }

    (!fragment) && setCalloutHighlightIndex(0);
    setCalloutFragment(fragment ? fragment : '');
    setMemberList(newMemberList);
  }
  const lookForCallout = (e, editor) => {
    if (memberList) {
      let { nativeEvent } = e;
      let max = memberList.length;

      if (isKeyHotkey([ 'up', 'down', 'tab' ], nativeEvent) && max > 0) {
        let newIndex = calloutHighlightIndex + (isKeyHotkey('up', nativeEvent) ? -1 : 1);
        setCalloutHighlightIndex((newIndex < 0) ? max - 1 : (newIndex >= max) ? 0 : newIndex);
        e.preventDefault();
      }
      if (isKeyHotkey('enter', nativeEvent) && max > 0) {
        e.preventDefault();
        insertCallout(editor);
        return true;
      }
    }
    return false;
  }
  const calloutOnClick = (editor) => {
    return (e) => {
      e.preventDefault();
      ReactEditor.focus(editor);
      insertCallout(editor, e.target.value);
      editorFix.keyUp(undefined, editor);
    }
  }
  const insertCallout = (editor, index) => {
    index = index ? index : calloutHighlightIndex;
    Transforms.delete(editor, {
      at: editor.selection.focus,
      distance: calloutFragment.length,
      unit: 'character',
      reverse: true
    });
    Transforms.insertNodes(
      editor,
      {
        type: 'badge',
        value: `@{${memberList[index].name}}`,
        children: [ { text: `@${memberList[index].name}` } ]
      },
      { at: editor.selection.focus });

    Transforms.move(editor, { unit: 'offset' });

    setCalloutFragment('');
    setMemberList([]);
    setCalloutHighlightIndex(0);
  }
  const calloutPosition = () => {
    let textarea = document.getElementById(id + 'slateInput');
    let dimensionsTA = textarea?.getBoundingClientRect();
    return {
      ...textarea && {
        bottom: window.innerHeight - dimensionsTA.y - 5,
        left: dimensionsTA.x,
        width: dimensionsTA.width,
      }
    }
  }
  const calloutProps = (editor) => {
    return {
      memberList,
      highlightStyle,
      style: calloutPosition(),
      id: `${id}callout`,
      calloutOnClick: calloutOnClick(editor)
    }
  }

  return {
    memberList,
    setMemberList,
    calloutFragment,
    setCalloutFragment,
    calloutHighlightIndex,
    setCalloutHighlightIndex,

    calloutProps,
    lookForCallout,
    calloutPosition,
    updateCalloutUi,
    insertCallout,
    calloutOnClick
  };

}
export {
  useCallout
}