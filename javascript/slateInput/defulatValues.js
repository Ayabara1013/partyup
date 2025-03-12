const editorDefault = {
  selection: {
    default: {
      anchor: { path: [ 0, 0 ], offset: 0 },
      focus: { path: [ 0, 0 ], offset: 0 }
    },
  },

  value: {
    default: [
      {
        type: 'paragraph',
        children: [ { text: '' } ],
      }
    ],
    simple: [
      {
        type: 'paragraph',
        children: [ { text: 'A journey to the west.' } ],
      },
      {
        type: 'paragraph',
        children: [ { text: 'A Classic Chinese Story.' } ],
      },
      {
        type: 'paragraph',
        children: [ { text: 'A wise quote.' } ],
      },
      {
        type: 'paragraph',
        children: [ { text: 'Try it out for yourself!' } ],
      },
    ],
  },

  activePlayers: [
    { name: 'Matthew', characterName: 'MattyR', callouts: [ 'Matty' ] },
    { name: 'Tony', characterName: 'Aetoz', callouts: [ 'Toz', 'Tones', 'Toast' ] },
    { name: 'David', characterName: 'LocoVikingo', callouts: [ 'Loco', 'Dave' ] },
    { name: 'Jeremy', characterName: 'Doc', callouts: [ 'Doc' ] },
  ],

  commands:[
    'roll', 'mute'
  ],
}
export {
  editorDefault
}