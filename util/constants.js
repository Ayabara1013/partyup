import { statLookUp } from "@/util/character/statLookUp";

const baseUrl = 'http://localhost:3000/'
const dieRegex = (die) => {
  return /^[1-9]d([1-9]|[1-9][0-9]|1[0-9][0-9])( .+)?/.test(die);
}
const isNumber = (input) =>{
  return /^\d+$/g.test(input)
}
const diceConcat = /[+-]/g
export {
  baseUrl,
  dieRegex,
  diceConcat,
  isNumber
}