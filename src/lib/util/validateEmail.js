function validateEmail(email) {
  let at = email.indexOf('@')
  if (at === -1) return false;

  // splitting email into 2
  let components = email.split('@');

  // checking if there are spaces
  if (components[0].indexOf(' ') !== -1) return false;

  //does the domain portion have a .com etc?
  if (components[1].slice(components[1].at('.')) === 'com')

    return true

  // console.log('click!')
}

export default validateEmail;