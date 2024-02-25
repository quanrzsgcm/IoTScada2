function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload)); const jsonData = JSON.parse(jsonString); const thingId = jsonData.thingId.split(':'); const value = {measurements: {properties: {power: jsonData.power, voltage: jsonData.voltage,current: jsonData.current}}}; return Ditto.buildDittoProtocolMsg(thingId[0], thingId[1], 'things', 'twin', 'commands', 'modify', '/features', headers, value);}
function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) 
{const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload)); 
    const jsonData = JSON.parse(jsonString); 
    const thingId = jsonData.thingId.split(':'); 
    const value = {
        measurements: {
            properties: {
                power: jsonData.power, 
                voltage: jsonData.voltage,
                current: jsonData.current,
                energy: jsonData.energy,
            }
            }
        }; 
    return Ditto.buildDittoProtocolMsg(thingId[0], thingId[1], 'things', 'twin', 'commands', 'modify', '/features', headers, value);}