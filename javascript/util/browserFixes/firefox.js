export const firefoxNumberInputOnKeyDown = (e) => {
  const isNumber = /^[0-9]$/i.test(e.key)
  console.log(e.keyCode)
  if (!(isNumber
    || (e.keyCode >= 3 && e.keyCode <= 47) //functional keys
    || (e.keyCode >= 112 && e.keyCode <= 151) //f keys  (There's like 32 of them??)
  )) {
    e.preventDefault()
  }
}