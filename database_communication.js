/**
 * Created by EUCJ on 12/19/2016.
 */

var processing = require('./processing')

module.exports.writeToTimeSeries = function (data, config, analysis = false) {

    let series_id = null;
    let provider = null;

    if (analysis == true) {
        series_id = config.analysis_series_identifier;
        provider = config.analysis_provider
    }
    else {
        series_id = config.time_series_identifier;
        provider = config.api_provider
    }


    let timeSeriesObject = processing.createTimeSeriesObject(data, provider)


    if (config.testing == true)
        config.writer.write("attemptedWriteToTimeSeries\n")


    config.pool.acquire(function (redisConnection) {


        return redisConnection.incr('series-counter:' + series_id).then((currentCounterValue) => {
            redisConnection.zadd('series:' + series_id, currentCounterValue, timeSeriesObject).then(() => {


                if (config.testing == true)
                    config.writer.write("succesefulWriteToTimeSeries\n");


            })
            ;
        });
    })


}

module.exports.getLastNFromTimeSeries = function (config) {


    if (config.testing == true)
        config.writer.write("attemptedDatabaseCollection\n")


    return config.pool.acquire((redisConnection) => {

        return redisConnection.get('series-counter:' + config.time_series_identifier).then((counterValue) => {
            return redisConnection.zrange('series:' + config.time_series_identifier, counterValue - config.analysis_n, counterValue);
        })

    }).then((lastN) => {

        if (config.testing == true)
            config.writer.write("succesefulDatabaseCollection\n");


        return processing.transformDatabaseObjectToArray(lastN)
    })


}

