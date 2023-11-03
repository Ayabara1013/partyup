import { useEffect, useState } from "react";
import { isKeyHotkey } from "is-hotkey";
import { Transforms } from "slate";
import { ReactEditor } from "slate-react";

import { ui } from "@/javascript/ui";
import { editorFix, editorTools } from "@/components/slatejs/(util)/editorUtil";

function addToList(member, list) {
  if (!list.includes(member)) {
    list.push(member);
  }
}

export const useCallout = (id, editor) => {
  const optionTypes = [ 'callout', 'command' ];
  const [ itemList, setItemList ] = useState([]);
  const [ textFragment, setTextFragment ] = useState('');
  const [ calloutHighlightIndex, setCalloutHighlightIndex ] = useState(0);

  const featureRegex = {
    callout: /@(?![{ ])/,
    command: /\/(?![\d ])/
  };

  const highlightStyle = 'bg-blue-200';

  useEffect(() => {
    let classes = highlightStyle.split(' ');
    if (itemList.length > 0) {
      for (let i in itemList) {
        ui.messaging.initOptions.element(id, i).classList.remove(classes);
      }
      ui.messaging.initOptions.element(id, calloutHighlightIndex).classList.add(classes);
    }
  }, [ calloutHighlightIndex ]);

  const update = (activePlayers, availableCommands = [ 'roll', 'mute' ]) => {
    let word = editorTools.offset.focusedFragment(editor);
    let fragment = undefined;
    let newItemList = [];

    if (featureRegex.callout.test(word)) {
      fragment = word;
      let formattedWord = word.toLowerCase().replace('@', '');
      for (let member of activePlayers) {
        let { name, characterName } = member;
        let item = { name, value: characterName }

        if (name.toLowerCase().includes(formattedWord) || characterName.toLowerCase().includes(formattedWord)) {
          addToList(item, newItemList);
        } else {
          for (let alias of member.callouts) {
            if (alias.toLowerCase().includes(formattedWord)) {
              addToList(item, newItemList);
              break;
            }
          }
        }
      }
    }

    if (featureRegex.command.test(word)) {
      fragment = word;
      let formattedFragment = word.toLowerCase().replace('/', '');
      for (let command of availableCommands) {
        if (command.includes(formattedFragment)) {
          let item = { name: command, value: command }
          newItemList.push(item);
        }
      }
    }

    (!fragment) && setCalloutHighlightIndex(0);
    setTextFragment(fragment || '');
    setItemList(newItemList);
  }

  const find = (e) => {
    let active = false;
    let { nativeEvent } = e;
    let max = itemList.length;
    if (itemList) {
      if (isKeyHotkey([ 'up', 'down', 'tab' ], nativeEvent) && max > 0) {
        e.preventDefault();
        let newIndex = calloutHighlightIndex + (isKeyHotkey('up', nativeEvent) ? -1 : 1);
        setCalloutHighlightIndex((newIndex < 0) ? max - 1 : (newIndex >= max) ? 0 : newIndex);
      }
      if (isKeyHotkey('enter', nativeEvent) && max > 0) {
        e.preventDefault();
        insertOption();
        active = true;
      }
    }
    return active;
  }

  const insertOption = (index) => {
    let featureType = 'badge';
    for (let type of optionTypes) {
      if (featureRegex[type].test(textFragment)) {
        featureType = type;
        break;
      }
    }
    index = index || calloutHighlightIndex;
    let newFocus = editorTools.offset.findFocus(editor, textFragment);
    Transforms.setSelection(editor, { focus: newFocus, anchor: newFocus })
    Transforms.delete(editor, {
      at: editor.selection.focus,
      distance: textFragment.length,
      unit: 'character',
      reverse: true
    });
    Transforms.insertNodes(
      editor,
      {
        type: 'badge',
        value: `${textFragment[0]}{${itemList[index].value}}`,
        featureType,
        children: [ { text: `${textFragment[0]}${itemList[index].name}` } ]
      },
      { at: editor.selection.focus });
    Transforms.move(editor, { unit: 'offset' });

    setTextFragment('');
    setItemList([]);
    setCalloutHighlightIndex(0);
  }

  const onClick = (e) => {
    e.preventDefault();
    ReactEditor.focus(editor);
    insertOption(e.target.value);
    editorFix.keyUp(undefined, editor);
  }

  const optionStyle = () => {
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

  const optionProps = () => {
    return {
      list: itemList,
      highlightStyle,
      style: optionStyle(),
      itemOnClick: onClick
    }
  }

  return { find, update, optionProps };
}