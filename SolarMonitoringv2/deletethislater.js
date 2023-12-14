// testDateTime.js
function testDateTime(dateTimeString) {
    const parsedDate = Date.parse(dateTimeString);

    if (!isNaN(parsedDate)) {
        console.log(`Parsing successful. Parsed timestamp: ${parsedDate}`);
        return true;
    } else {
        console.error(`Parsing failed. Invalid DateTime string: ${dateTimeString}`);
        return false;
    }
}
const dummydata = [
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T00:00:00+07:00",
        "power": "75.00",
        "voltage": "70.00",
        "current": "52.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T00:15:00+07:00",
        "power": "75.00",
        "voltage": "96.00",
        "current": "38.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T00:30:00+07:00",
        "power": "67.00",
        "voltage": "53.00",
        "current": "29.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T00:45:00+07:00",
        "power": "5.00",
        "voltage": "56.00",
        "current": "96.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T01:00:00+07:00",
        "power": "10.00",
        "voltage": "14.00",
        "current": "91.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T01:15:00+07:00",
        "power": "15.00",
        "voltage": "4.00",
        "current": "99.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T01:30:00+07:00",
        "power": "98.00",
        "voltage": "4.00",
        "current": "76.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T01:45:00+07:00",
        "power": "74.00",
        "voltage": "68.00",
        "current": "10.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T02:00:00+07:00",
        "power": "45.00",
        "voltage": "22.00",
        "current": "48.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T02:15:00+07:00",
        "power": "97.00",
        "voltage": "65.00",
        "current": "16.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T02:30:00+07:00",
        "power": "18.00",
        "voltage": "53.00",
        "current": "1.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T02:45:00+07:00",
        "power": "81.00",
        "voltage": "78.00",
        "current": "73.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T03:00:00+07:00",
        "power": "99.00",
        "voltage": "73.00",
        "current": "27.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T03:15:00+07:00",
        "power": "20.00",
        "voltage": "18.00",
        "current": "99.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T03:30:00+07:00",
        "power": "30.00",
        "voltage": "35.00",
        "current": "95.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T03:45:00+07:00",
        "power": "58.00",
        "voltage": "22.00",
        "current": "39.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T04:00:00+07:00",
        "power": "10.00",
        "voltage": "6.00",
        "current": "70.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T04:15:00+07:00",
        "power": "86.00",
        "voltage": "85.00",
        "current": "87.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T04:30:00+07:00",
        "power": "72.00",
        "voltage": "63.00",
        "current": "46.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T04:45:00+07:00",
        "power": "68.00",
        "voltage": "95.00",
        "current": "11.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T05:00:00+07:00",
        "power": "92.00",
        "voltage": "76.00",
        "current": "15.00"
    },
    {
        "meter_id": "pm03",
        "timestamp": "2023-12-01T05:15:00+07:00",
        "power": "6.00",
        "voltage": "65.00",
        "current": "65.00"
    },
]

// Example usage:
const validDateTimeString = '2023-12-08T12:34:56Z';
const myef = '2023-12-01T08:15:00+07:00';
const invalidDateTimeString = 'Invalid DateTime String';
console.log(dummydata);
var newdata = dummydata.map((item) => ({
    x: item.timestamp,
    y: item.power,
}));
console.log(newdata);


console.log('Testing valid DateTime string:');
testDateTime(myef);


