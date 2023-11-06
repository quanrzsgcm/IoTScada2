const dayjs = require('dayjs');
const d = new Date(2019, 8, 19);
var specificDate = dayjs("2023-11-06 12:30:00");
dayjs.extend(objectSupport)

const day = dayjs({ years:2010, months:3, date:5, hours:15, minutes:10, seconds:3, milliseconds:123});

console.log(day.format()); // Format to see the date and time
