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


function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) { const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload)); const jsonData = JSON.parse(jsonString); const thingId = ["my.inverter", "inv01"]; const value = { measurements: { properties: { capacity: jsonData.values.capacity, internalTemp: jsonData.values.internalTemp, inputPower: jsonData.values.inputPower, gridFrequency: jsonData.values.gridFrequency, powerFactor: jsonData.values.powerFactor, } } }; thingId[0] = 'my.inverter'; thingId[1] = jsonData.node; return Ditto.buildDittoProtocolMsg(thingId[0], thingId[1], 'things', 'twin', 'commands', 'modify', '/features', headers, value); }


function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {
    const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload));
    const jsonData = JSON.parse(jsonString);
    const thingId = ["my.inverter", "placeholder"];
    const value = {
        
        measurements: {
            properties: {
                meterReadTotalEnergy: jsonData.values.powerFactor,
                activePower: jsonData.values.activePower,
                inputPower: jsonData.values.inputPower,
                efficiency: jsonData.values.efficiency,
                internalTemp: jsonData.values.internalTemp,
                gridFrequency: jsonData.values.gridFrequency,
                productionToday: jsonData.values.productionToday,
                yieldToday: jsonData.values.yieldToday,
            }
        },
        runningstatus: {
            properties: {
                stage: "Empty",
                stagestarton: null,
                StageDuration: 0
            }
        },
        label: {
            properties: {
                labels: []
            }
        }
    };
    thingId[0] = 'my.inverter';
    thingId[1] = jsonData.node;
    return Ditto.buildDittoProtocolMsg(
        thingId[0], 
        thingId[1], 
        'things', 
        'twin', 
        'commands', 
        'modify', 
        '/features', 
        headers, 
        value
    );
}


function mapFromDittoProtocolMsg(namespace, id, group, channel, criterion, action, path, dittoHeaders, value, status, extra) {
    // Create text data
    let textPayload = '{"temperature": ' + value.measurements.properties.activePower + ', "thingId": "' + namespace + ':' + id + '"}';

    // In this case we data only in text format
    let bytePayload = null;
    // Set message content type
    let contentType = 'text/plain; charset=UTF-8';

    // Return mapped message
    return  Ditto.buildExternalMsg(
        dittoHeaders,
        textPayload,
        bytePayload,
        contentType
    );
}