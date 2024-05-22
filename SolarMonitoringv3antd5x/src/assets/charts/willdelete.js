function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {
    const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload));
    const jsonData = JSON.parse(jsonString);
    const thingId = ["my.inverter", "placeholder"];
    thingId[0] = 'my.inverter';
    thingId[1] = jsonData.node;
    const values = jsonData.values || {}; // Ensure jsonData.values exists

    // Check if values is an empty object
    const isValuesEmpty = Object.keys(values).length === 0;
    if (isValuesEmpty){
        const errors = jsonData.errors;
        const noResponse = Object.values(errors).includes(3015);
        const disCon = Object.values(errors).includes(3002);
        let newState = "";

        if (disCon) {
            newState = "Disconnected";
        } else if (noResponse) {
            newState = "No response";
        }

        return Ditto.buildDittoProtocolMsg(
            thingId[0],
            thingId[1],
            'things',
            'twin',
            'commands',
            'modify',
            '/features/measurements/properties/state',
            headers,
            newState
        );

    }

    var stageStr = "";
    switch (jsonData.values.stage) {
        case 1:
            stageStr = 'noCom';
            break;
        case 2:
            stageStr = 'connectionFail';
            break;
        case 3:
            stageStr = 'nonOperative';
            break;
        case 4:
            stageStr = 'fullCapability';
            break;
        case 5:
            stageStr = 'nightState';
            break;
        default:
            stageStr = null;
    }

    const value = {
        capacity: jsonData.values.capacity,
        meterReadTotalEnergy: jsonData.values.meterReadTotalEnergy,
        activePower: jsonData.values.activePower,
        inputPower: jsonData.values.inputPower,
        efficiency: jsonData.values.efficiency,
        internalTemp: jsonData.values.internalTemp,
        gridFrequency: jsonData.values.gridFrequency,
        productionToday: jsonData.values.productionToday,
        yieldToday: jsonData.values.yieldToday,
        reactivePower: jsonData.values.reactivePower,
        apparentPower: jsonData.values.apparentPower,
        powerFactor: jsonData.values.powerFactor,
        fanSpeed: jsonData.values.fanSpeed,
        limitOutput: jsonData.values.limitOutput,
        state: "Full Capability", 
    };


    return Ditto.buildDittoProtocolMsg(
        thingId[0],
        thingId[1],
        'things',
        'twin',
        'commands',
        'modify',
        '/features/measurements/properties',
        headers,
        value
    );
}