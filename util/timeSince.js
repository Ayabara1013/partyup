

/**
 * 
 * @param {*} date in format 'yyyy-mm-dd'
 * @param {*} type either 'conversational', 'condensed', or blank
 * @returns 
 */
export default function timeSince(date, type) {
  if (date === 'random') {
    // Pick a random date in the last 2 weeks
    const twoWeeksAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;
    const randomDate = new Date(twoWeeksAgo + Math.random() * 60 * 24 * 60 * 60 * 1000);
    date = randomDate;
  }

  var seconds = Math.floor((new Date() - date) / 1000);

  var years = Math.floor(seconds / 31536000);
  seconds %= 31536000;

  var months = Math.floor(seconds / 2592000);
  seconds %= 2592000;

  var days = Math.floor(seconds / 86400);

  // if (type === 'conversational') {

  // }
  // else if (type === 'scientific') {
  //   return `${years}y, ${months}m, ${days}d`;
  // }
  // else

  const strings = {
    conv: {
      years: `${years} years`,
    }
  }

  switch (type) {
    case 'conversational':
      return `${years ? `${years} ${years === 1 ? 'year' : 'years'}` : ''}${years && (months || days) ? ',' : ''}
      ${months ? `${months} ${months === 1 ? 'month' : 'months'}` : ''}${months && days ? ',' : ''}
      ${days ? `${days} ${days === 1 ? 'day' : 'days'}` : ''}`;
    case 'condensed':
      break;
    default:
      return `${years}y, ${months}m, ${days}d`;
  }
}
