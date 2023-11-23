const dayjs = require('dayjs');

const date = new Date();
const jsonString = JSON.stringify(date);
console.log(date); // Logs: "2023-12-12T07:15:31.068Z"
console.log(typeof(date)); // Logs: "2023-12-12T07:15:31.068Z"
console.log(date.toString()); // Logs: "2023-12-12T07:15:31.068Z"


// console.log(jsonString); // Logs: "2023-12-12T07:15:31.068Z"

// // Parse the JSON string back into a JavaScript object
// const parsedDate = JSON.parse(jsonString);

// console.log(parsedDate); // Logs: 2023-12-12T07:15:31.068Z
