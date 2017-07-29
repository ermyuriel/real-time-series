/**
 * Created by EUCJ on 12/19/2016.
 */

var processing = require('./processing')

module.exports.writeToTimeSeries = function (series_identifier, data, pool, apiProvider) {


    let timeSeriesObject = processing.createTimeSeriesObject(data, apiProvider)

    pool.acquire(function (redisConnection) {


        return redisConnection.incr('series-counter:' + series_identifier).then((currentCounterValue) => {
            redisConnection.zadd('series:' + series_identifier, currentCounterValue, timeSeriesObject);
        });
    })


}

module.exports.getLastNFromTimeSeries = function (n, siteId, pool) {

    return pool.acquire((redisConnection) => {

        return redisConnection.get('series-counter:' + siteId).then((counterValue) => {
            return redisConnection.zrange('series:' + siteId, counterValue - n, counterValue);
        })

    }).then((lastN) => {
        return processing.transformDatabaseObjectToArray(lastN)
    })


}

