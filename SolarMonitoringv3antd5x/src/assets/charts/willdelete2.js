// Sample received message
const receivedMessage = `{
    "node": "inv1",
    "group": "test",
    "timestamp": 1716382412636,
    "values": {},
    "errors": {
        "meterReadTotalEnergy": 3015,
        "activePower": 3015,
        "inputPower": 3015,
        "efficiency": 3015,
        "internalTemp": 3015,
        "gridFrequency": 3015,
        "productionToday": 3015,
        "yieldToday": 3015,
        "reactivePower": 3015,
        "apparentPower": 3015,
        "powerFactor": 3015,
        "stage": 3015,
        "capacity": 3015,
        "fanSpeed": 3015,
        "limitOutput": 3015
    },
    "metas": {}
}`;

// Parse the JSON string to a JavaScript object
const messageObject = JSON.parse(receivedMessage);

// Access the errors object
const errors = messageObject.errors;
console.log(errors);

// Function to check if any value in the errors object is 3015
function containsErrorValue(errors, valueToCheck) {
    return Object.values(errors).includes(valueToCheck);
}

// Check if any value in the errors object is 3015
const hasError3015 = containsErrorValue(errors, 3016);

console.log(hasError3015); // Output: true
