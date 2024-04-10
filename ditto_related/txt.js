function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) { const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload)); const jsonData = JSON.parse(jsonString); const thingId = jsonData.thingId.split(':'); const value = { measurements: { properties: { power: jsonData.power, voltage: jsonData.voltage, current: jsonData.current } } }; return Ditto.buildDittoProtocolMsg(thingId[0], thingId[1], 'things', 'twin', 'commands', 'modify', '/features', headers, value); }
function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {
    const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload));
    const jsonData = JSON.parse(jsonString);
    const thingId = jsonData.thingId.split(':');
    const value = {
        measurements: {
            properties: {
                capacity: jsonData.capacity,
                internalTemp: jsonData.internalTemp,
                inputPower: jsonData.inputPower,
                gridFrequency: jsonData.gridFrequency,
                powerFactor: jsonData.powerFactor,
            }
        }
    };
    return Ditto.buildDittoProtocolMsg(thingId[0], thingId[1], 'things', 'twin', 'commands', 'modify', '/features', headers, value);
}

function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {
    const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload));
    const jsonData = JSON.parse(jsonString);
    const thingId = ["my.inverter", "inv01"];
    const value = {
        measurements:
        {
            properties:
            {
                capacity: jsonData.values.tempvalue1,
                internalTemp: jsonData.values.tempvalue1,
                inputPower: jsonData.values.tempvalue1,
                gridFrequency: jsonData.values.tempvalue2,
                powerFactor: jsonData.values.tempvalue1,
            }
        }
    };
    thingId[0] = 'my.inverter';
    thingId[1] = jsonData.node;
    return Ditto.buildDittoProtocolMsg(thingId[0], thingId[1], 'things', 'twin', 'commands', 'modify', '/features', headers, value);
}



function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) { const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload)); const jsonData = JSON.parse(jsonString); const thingId = ["my.inverter", "inv01"]; const value = { measurements: { properties: { capacity: jsonData.values.capacity, internalTemp: jsonData.values.internalTemp, inputPower: jsonData.values.inputPower, gridFrequency: jsonData.values.gridFrequency, powerFactor: jsonData.values.powerFactor, } } }; thingId[0] = 'my.inverter'; thingId[1] = jsonData.node; return Ditto.buildDittoProtocolMsg(thingId[0], thingId[1], 'things', 'twin', 'commands', 'modify', '/features', headers, value); }


Trung topic === source address

awer = {
    "node": "inv17",
    "group": "defaultgroup",
    "timestamp": 1712290866064,
    "values": {
        "capacity": 4321,
        "internalTemp": 1111,
        "inputPower": 2222,
        "gridFrequency": 3333,
        "powerFactor": 4444
    },
    "errors": {},
    "metas": {}
}

