import findCallout from "@/chatReader/callout";

export function calloutTest() {
  let text = 'hello @ma';
  let members = [
    { name: 'Matthew', characterName: 'MattyR', callouts: [ 'Matty' ] },
    { name: 'Tony', characterName: 'Aetoz', callouts: [ 'Toz', 'Tones', 'Toast' ] },
    { name: 'David', characterName: 'LocoVikingo', callouts: [ 'Loco', 'Dave' ] },
    { name: 'Jeremy', characterName: 'Doc', callouts: [ 'Doc' ] },
  ];
  let output = findCallout(text, members);
}