// generateData.js

const fs = require('fs');

function generateData() {
    const rawData = [];
    const start = new Date();
    start.setHours(0, 0, 0, 0); // Set to midnight

    for (let i = 0; i < 24 * 12; i++) { // 24 hours * 12 intervals per hour (5-minute intervals)
        const hours = String(start.getHours()).padStart(2, '0');
        const minutes = String(start.getMinutes()).padStart(2, '0');
        const time = `${hours}:${minutes}`;


         // Generate random values for ActivePower and Irradiance between 1 and 1000
         const activePower = Math.floor(Math.random() * 1000) + 1;
         const irradiance = Math.floor(Math.random() * 1000) + 1;
 
         rawData.push({
             Time: time,
             ActivePower: activePower,
             Irradiance: irradiance
         });

        start.setMinutes(start.getMinutes() + 5); // Increment by 5 minutes
    }

    return rawData;
}

const rawData = generateData();
fs.writeFileSync('output.json', JSON.stringify(rawData, null, 2), 'utf-8');
console.log('Data written to output.json');
