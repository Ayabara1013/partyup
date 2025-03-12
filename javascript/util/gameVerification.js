export default function verifyGameData(game) {
  let {
    name,
    description,
    isPublic,
    maxPlayers,
    hasActs,
    currentAct,
    maxActs,
    hasChapters,
    currentChapter,
    maxChapters
  } = game;

  let errorMessage = '';

  name.trim().length === 0 && (errorMessage += 'Name cannot be empty.');
  isPublic

}