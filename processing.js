var _ = require('underscore')
var db = require('./database_communication');
var parsers = require('./api_parsers')


module.exports.createTimeSeriesObject = function (data, apiProvider) {

    let date = Date.now();

    let parsedData = parsers[apiProvider](data)


    let timeSeriesObject = JSON.stringify({
        'timestamp': date, 'data': parsedData
    });


    return timeSeriesObject

}


module.exports.transformToRArrays = function (databaseObject) {
    let timestamps = []
    let data = [];

    for (let i = 0; i < databaseObject.length; i++) {

        timestamps.push(JSON.parse(databaseObject[i])['timestamp']);

        data.push(JSON.parse(databaseObject[i])['data']);


    }
    let arrays = {timestamps: timestamps, data: data}

    return arrays;
}
