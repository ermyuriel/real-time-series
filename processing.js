var _ = require('underscore')
var db = require('./database_communication');
var parsers = require('./api_parsers')


module.exports.createTimeSeriesObject = function (data, provider) {

    let time = Date.now();



    let parsedData = parsers[provider](data)


    let timeSeriesObject = JSON.stringify({
        'timestamp': time, 'data': parsedData
    });


    return timeSeriesObject

}


module.exports.transformDatabaseObjectToArray = function (databaseObject) {
    let timestamps = []
    let data = [];

    for (let i = 0; i < databaseObject.length; i++) {

        timestamps.push(JSON.parse(databaseObject[i])['timestamp']);

        data.push(JSON.parse(databaseObject[i])['data']);


    }
    let arrays = {timestamps: timestamps, data: data}

    return arrays;
}
