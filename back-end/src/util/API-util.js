/**
 * Converts a Date string from the DB to a string to form YYYY-MM-DD HH:MM:SS
 * @param {Date} date
 * @return {string} string in form YYYY-MM-DD HH:MM:SS
 */
function dateToDBString(date) {
  if (!date) {
    return null;
  }
  let formatted_date =
    date.getFullYear() +
    '-' +
    appendLeadingZeroes(date.getMonth() + 1) +
    '-' +
    appendLeadingZeroes(date.getDate()) +
    ' ' +
    appendLeadingZeroes(date.getHours()) +
    ':' +
    appendLeadingZeroes(date.getMinutes()) +
    ':' +
    appendLeadingZeroes(date.getSeconds());
  return formatted_date;
}

/**
 * Appends a leading 0 to the string representation of the number, if the number is 0<n<10
 * @param {Integer} number
 * @returns {string}
 */
function appendLeadingZeroes(number) {
  if (number <= 9) {
    return '0' + number;
  }
  return number;
}

/**
 * Standard messages for common response status
 * @param {int} status
 */
function msgJson(status) {
  let msg;
  switch (status) {
    case 200:
      msg = 'OK';
      break;
    case 204:
      msg = 'No Content';
      break;
    case 400:
      msg = 'Bad Request';
      break;
    case 401:
      msg = 'Unauthorized';
      break;
    case 500:
      msg = 'Internal Error';
      break;
    case 503:
      msg = 'Service Unavailable';
      break;
    default:
      msg = 'Unknown status code';
  }
  return { message: msg };
}

module.exports = {
  dateToDBString,
  msgJson,
};
