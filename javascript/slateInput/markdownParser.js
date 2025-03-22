const markdownParser = {
  toDisplay: function (text) {
    return newLineParser(text, false)

  },
  toEditor: function (text) {
    return newLineParser(text, true)
  }
}

function newLineParser(text, keepMarkdown) {
  let baseArray = [];
  let newLineSplit = text.split('\n');
  for (let i = 0; i < newLineSplit.length; i++) {
    baseArray.push(paragraphParser(newLineSplit[i], keepMarkdown));
  }
  return baseArray;
}

function paragraphParser(text, keepMarkdown) {
  let baseElement = {
    type: `paragraph`,
    children: []
  }
  calloutParser(text, baseElement, keepMarkdown);
  return baseElement;
}

function calloutParser(text, baseElement, keepMarkdown) {

}

function boldItalicParser(text, baseElement, keepMarkdown) {
  return {text};
}

export default markdownParser;