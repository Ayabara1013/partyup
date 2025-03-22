import {useEffect, useState} from "react";
import {isKeyHotkey} from "is-hotkey";
import {Transforms} from "slate";
import {ReactEditor} from "slate-react";
import {editorFix, editorTools} from "@/javascript/slateInput/editorUtil";
import toast from "react-hot-toast";

function addToList(member, list) {
  if (!list.includes(member)) {
    list.push(member);
  }
}

export const useChatOptions = (chatOptionsRefs, editor) => {
  const optionTypes = ['mention', 'command', 'dice'];
  const [itemList, setItemList] = useState([]);
  const [textFragment, setTextFragment] = useState('');
  const [optionHighlightIndex, setOptionHighlightIndex] = useState(0);
  const {mainRef} = chatOptionsRefs
  const highlightStyle = 'input-accent';
  const featureRegex = {
    mention: /@(?![{ ])/,
    command: /\/(?![\d ])/,
    dice: /~(?! )/
  };

  useEffect(() => {
    let classes = highlightStyle.split(' ');
    if (itemList.length > 0) {
      for (let i = 0; i < 9; i++) {
        let listRef = chatOptionsRefs.optionRefs[i].current;
        if (listRef) {
          listRef.classList.remove(classes);
          if (i === optionHighlightIndex) listRef.classList.add(classes)
        }
      }
    }
  }, [optionHighlightIndex]);

  const cycleOptionIndex = (e) => {
    let {nativeEvent} = e;
    let max = itemList.length;
    if(isKeyHotkey(`escape`, nativeEvent)) {
      setTextFragment('');
      setItemList([]);
      setOptionHighlightIndex(0);
      return true;
    }
    if (itemList) {
      if (isKeyHotkey(['up', 'down', 'tab'], nativeEvent) && max > 0) {
        e.preventDefault();
        let newIndex = optionHighlightIndex + (isKeyHotkey('up', nativeEvent) ? -1 : 1);
        //set index. Conditional settings lets user re-cycle through the list. 
        setOptionHighlightIndex((newIndex < 0) ? max - 1 : (newIndex >= max) ? 0 : newIndex);
      }
      //If the user pressed enter, insert the option
      if (isKeyHotkey('enter', nativeEvent) && max > 0) {
        e.preventDefault();
        insertOptionIntoEditor();
        return true;
      }
    }
    return false;
  }

  const updateOptionsFilter = (activePlayers, availableCommands = ['roll', 'mute']) => {
    let word = editorTools.offset.focusedFragment(editor);
    let fragment = undefined;
    let baseOptionPopulater = {
      mention: activePlayers,
      command: availableCommands,
      dice: []
    }
    let newOptions = [];

    for (let type of optionTypes) {
      if (featureRegex[type].test(word)) {
        fragment = word;
        filterOptions[type](word, baseOptionPopulater[type], newOptions);
        break;
      }
    }

    (!fragment) && setOptionHighlightIndex(0)
    setTextFragment(fragment || '');
    setItemList(newOptions);
  }

  const insertOptionIntoEditor = (index) => {
    let featureType = 'mention';
    for (let type of optionTypes) {
      if (featureRegex[type].test(textFragment)) {
        featureType = type;
        break;
      }
    }
    index = index || optionHighlightIndex;
    let newFocus = editorTools.offset.findFocus(editor, textFragment);
    let badgeValue = featureType !== 'dice' ? `${textFragment[0]}${itemList[index].value}` : textFragment;
    if (featureType === `dice` && itemList.length === 1) {
      toast.error(`Invalid dice format entered. The system will not roll when message is sent.`);
    }

    Transforms.setSelection(editor, {focus: newFocus, anchor: newFocus})
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
        featureType,
        //If type is dice, input what the use put in else select the option.
        children: [{text: badgeValue}]
      },
      {at: editor.selection.focus});
    Transforms.move(editor, {unit: 'offset'});

    console.log(editor.children)
    setTextFragment('');
    setItemList([]);
    setOptionHighlightIndex(0);
  }

  const selectOption = (e) => {
    if (e) e.preventDefault();
    ReactEditor.focus(editor);
    insertOptionIntoEditor((e) ? e.target.value : optionHighlightIndex);
    editorFix.keyUp(undefined, editor);
  }

  const optionStyle = () => {
    let editorElement = mainRef.current;
    let dimensionsTA = editorElement?.getBoundingClientRect();
    return {
      ...editorElement && {
        bottom: window.innerHeight - dimensionsTA.y + 5,
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
      onClick: selectOption
    }
  }

  return {cycleOptionIndex, updateOptionsFilter, optionProps};
}

const filterOptions = {
  mention: function (word, activePlayers, newOptionList) {
    let formattedWord = word.toLowerCase().replace('@', '');
    for (let member of activePlayers) {
      let {name, characterName} = member;
      let item = {name, value: characterName}

      if (name.toLowerCase().includes(formattedWord) || characterName.toLowerCase().includes(formattedWord)) {
        addToList(item, newOptionList);
      } else {
        for (let alias of member.callouts) {
          if (alias.toLowerCase().includes(formattedWord)) {
            addToList(item, newOptionList);
            break;
          }
        }
      }
    }
  },
  command: function (word, availableCommands, newOptionList) {
    let formattedFragment = word.toLowerCase().replace('/', '');
    for (let command of availableCommands) {
      if (command.includes(formattedFragment)) {
        let item = {name: command, value: command}
        newOptionList.push(item);
      }
    }
  },
  dice: function (word, arrayPlaceholder, newOptionList) {
    let formatedWord = word.toLowerCase().replace('~', '');
    let singleDiceRegex = /^[Dd]\d+$/;
    let multiDiceRegex = /\d+[Dd]\d+/;
    let sequenceDiceRegex = /\d*[Dd]\d+([.]\d*[Dd]\d+)+/;

    if (singleDiceRegex.test(formatedWord)) {
      newOptionList.push({
        name: `Single Roll, Single Die`,
        value: `SRSD`,
      })
    }
    if (multiDiceRegex.test(formatedWord)) {
      newOptionList.push({
        name: `Multi Roll, Single Die`,
        value: `MRSD`,
      })
    }
    if (sequenceDiceRegex.test(formatedWord)) {
      newOptionList.push({
        name: `Multi Roll, Multi Die`,
        value: `MRMD`,
      })
    }
    newOptionList.push({
      name: `Die Format: Single: ~d20 | Multi: ~2d20  | Sequence: ~2d20.3d10`,
      value: `Info-Option`,
    })
  }
}