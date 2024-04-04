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

function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) 
{const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload));
    const jsonData = JSON.parse(jsonString);
    const thingId = ["my.inverter", "inv01"];
    const value = {measurements: 
        {properties: 
            {capacity: jsonData.values.tempvalue1,
                internalTemp: jsonData.values.tempvalue1,
                inputPower: jsonData.values.tempvalue1,
                gridFrequency: jsonData.values.tempvalue2,
                powerFactor: jsonData.values.tempvalue1,}}};
    thingId[0]= 'my.inverter';
    thingId[1]= jsonData.node;
    return Ditto.buildDittoProtocolMsg(thingId[0], thingId[1], 'things', 'twin', 'commands', 'modify', '/features', headers, value);}