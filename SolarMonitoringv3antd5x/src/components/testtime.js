const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

function getStartAndEndOfDay(isoString, timezoneOffset) {
  // Check if isoString is null or undefined
  if (isoString == null) {
    console.log("isoString is null or undefined");
    return null;
  }

  console.log(isoString);

  const originalDate = dayjs(isoString);

  if (!originalDate.isValid()) {
    console.log("Invalid date string: ", isoString);
    return null;
  }

    // Set the time to 00:00:00 in the specified timezone
    const startOfDay = originalDate.utcOffset(timezoneOffset).startOf('day');

    // Set the time to 23:59:59 in the specified timezone
    const endOfDay = originalDate.utcOffset(timezoneOffset).endOf('day');
  console.log("I have come to here");

  return {
    startOfDay: startOfDay.toISOString(),
    endOfDay: endOfDay.toISOString(),
  };
}
module.exports = { getStartAndEndOfDay };