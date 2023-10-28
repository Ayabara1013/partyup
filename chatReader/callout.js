let unFinishedCallout = /@(?![{ ])/
let finishedCallout = /@{.*}/


let members = [
  { name: 'Matthew', characterName: 'MattyR', callouts: [ 'Matty' ] },
  { name: 'Tony', characterName: 'Aetoz', callouts: [ 'Toz', 'Tones', 'Toast' ] },
  { name: 'David', characterName: 'LocoVikingo', callouts: [ 'Loco', 'Dave' ] },
  { name: 'Jeremy', characterName: 'Doc', callouts: [ 'Doc' ] },
];

function addToList(member, list) {
  if (!list.includes(member)) {
    list.push(member);
  }
}

function findCallout(text, members) {
  let sections = text.split(' ');
  let memberList = [];
  let callout = null;
  for (let section of sections) {
    if (unFinishedCallout.test(section)) {
      let sectionLC = section.toLowerCase().replace('@', '');
      callout = section;
      for (let member of members) {
        let { name, characterName } = member;
        name = name.toLowerCase();
        characterName = characterName.toLowerCase();

        if (name.includes(sectionLC)) {
          addToList(member, memberList);
        } else if (characterName.includes(sectionLC)) {
          addToList(member, memberList);
        } else {
          //match callouts and add to list
          for (let alias of member.callouts) {
            let aliasLC = alias.toLowerCase();
            if (aliasLC.includes(sectionLC)) {
              addToList(member, memberList);
              break;
            }
          }
        }
      }
      break;
    }
  }
  return { callout, memberList };
}

function caretSelection(element) {
  let caretPosition = element.selectionStart;
  let words = element.value.split(' ');
  let wordIndex = 0;
  let characterCount = 0;
  while (characterCount <= caretPosition) {
    characterCount += words[wordIndex].length + 1;
    wordIndex++;
  }
  if (wordIndex < 0) {
    wordIndex = 0;
  }
  return words[wordIndex - 1]
}

function inputEvent(callback) {
  return (e) => {
    let element = e.target;
    let selectedWord = caretSelection(element);
    let callout = findCallout(element.value, members);
    if (selectedWord === callout.callout) {
      callback(callout);
      return;
    }
    callback(null);
  }
}

export function caretEventProps(callback) {
  return {
    onKeyUp: inputEvent(callback),
    onMouseUp: inputEvent(callback),
    onTouchStart: inputEvent(callback),
    onInput: inputEvent(callback),
    onPaste: inputEvent(callback),
    onCut: inputEvent(callback),
    onSelect: inputEvent(callback),
  }
}