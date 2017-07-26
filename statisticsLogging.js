var Redis = require('ioredis');
var RedisPool = require('./redisPool');
var stats = require("stats-lite");
var db = require('./db-processing');

module.exports.startLoggingCumulativeStatistics = function (siteId, targetParameter, n, subN, subInterval, interval) {
    pool = RedisPool.getPool();

    setInterval(()=> {
        logAverage(siteId, targetParameter, subN)
    }, subInterval);

    setInterval(()=> {
        logCumulativeAverage(siteId, targetParameter, n)
    }, interval);


}

getLastNFromStatistics = function (n, siteId, targetParameter) {


    return pool.acquire((redisConnection)=> {

        return redisConnection.get('statistics-counter-' + targetParameter + ':' + siteId).then((counterValue)=> {
            return redisConnection.zrange('statistics-' + targetParameter + ':' + siteId, counterValue - n, counterValue);
        })
    })
}


logCumulativeAverage = function (siteId, targetParameter, n) {

    getLastNFromStatistics(n, siteId, targetParameter).then(lastN=> {

        let array = db.getArrayFromDatabaseObject(lastN, 'average');


        let average = stats.mean(array);
        let std = stats.stdev(array);
        let date = Date.now();

        let meanObject = JSON.stringify({
            'siteId': siteId,
            'timestamp': date,
            'parameter': targetParameter,
            'cumulative-average': average,
            'cumulative-standard-deviation': std
        });


        pool.acquire(redisConnection=> {
            return redisConnection.incr('cumulative-statistics-counter-' + targetParameter + ':' + siteId).then((currentCounterValue)=> {
                redisConnection.zadd('cumulative-statistics-' + targetParameter + ':' + siteId, currentCounterValue, meanObject);
            })


        });


    })
};


logAverage = function (siteId, targetParameter, n) {

    db.getLastNFromSeries(n, siteId).then(lastN=> {

        let array = db.getValuesFromJsonArray(db.getArrayFromDatabaseObject(lastN, 'data'), targetParameter);


        let average = stats.mean(array);
        let std = stats.stdev(array);
        let date = Date.now();

        let meanObject = JSON.stringify({
            'siteId': siteId,
            'timestamp': date,
            'parameter': targetParameter,
            'average': average,
            'standard-deviation': std
        });

        pool.acquire(redisConnection=> {
            return redisConnection.incr('statistics-counter-' + targetParameter + ':' + siteId).then((currentCounterValue)=> {
                redisConnection.zadd('statistics-' + targetParameter + ':' + siteId, currentCounterValue, meanObject);
            });
        });


    });


}



