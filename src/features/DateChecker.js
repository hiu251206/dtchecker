/**
 * Returns the number of days in the given month of a given year using the Gregorian calendar.
 * @param {number} year - The year (1000 - 3000)
 * @param {number} month - The month (1 - 12)
 * @returns {number} The number of days (28, 29, 30, or 31), or 0 if invalid month.
 */
export function daysInMonth(year, month) {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return 31;

    case 4:
    case 6:
    case 9:
    case 11:
      return 30;

    case 2:
      if (year % 400 === 0) {
        return 29;
      } else if (year % 100 === 0) {
        return 28;
      } else if (year % 4 === 0) {
        return 29;
      } else {
        return 28;
      }

    default:
      return 0;
  }
}

/**
 * Determines whether the given date exists in the Gregorian calendar.
 * @param {number} day - The day (1 - 31)
 * @param {number} month - The month (1 - 12)
 * @param {number} year - The year (1000 - 3000)
 * @returns {boolean} True if the date is valid, false otherwise.
 */
export function isValidDate(day, month, year) {
  if (year < 1000 || year > 3000) {
    return false;
  }
  if (month < 1 || month > 12) {
    return false;
  }
  if (day < 1 || day > daysInMonth(year, month)) {
    return false;
  }
  return true;
}
