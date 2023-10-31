

export function getRandomInt(min = 1000, max = 100000) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}