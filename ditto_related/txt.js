function mapToDittoProtocolMsg(headers, textPayload, bytePayload, contentType) {
    const jsonString = String.fromCharCode.apply(null, new Uint8Array(bytePayload));
    const jsonData = JSON.parse(jsonString);
    const thingId = ["my.inverter", "placeholder"];
    thingId[0] = 'my.inverter';
    thingId[1] = jsonData.node;

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
        meterReadTotalEnergy: jsonData.values.meterReadTotalEnergy || null,
        activePower: jsonData.values.activePower || null,
        inputPower: jsonData.values.inputPower || null,
        efficiency: jsonData.values.efficiency || null,
        internalTemp: jsonData.values.internalTemp || null,
        gridFrequency: jsonData.values.gridFrequency || null,
        productionToday: jsonData.values.productionToday || null,
        yieldToday: jsonData.values.yieldToday || null,
        reactivePower: jsonData.values.reactivePower || null,
        apparentPower: jsonData.values.apparentPower || null,
        powerFactor: jsonData.values.powerFactor || null,
        stage: stageStr, 
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