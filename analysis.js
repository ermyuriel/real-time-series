/**
 * Created by EUCJ on 12/19/2016.
 */


var _ = require('underscore')
var db = require('./db-processing');
var RedisPool = require('./redisPool');


module.exports.startAnalysis = function (siteId, targetParameter, n, trendingInterval, viralInterval, filter) {


    pool = RedisPool.getPool();


    setInterval(()=> {
        analyseTrending(siteId, targetParameter, n)
    }, trendingInterval);

    setInterval(()=> {
        analyseViral(siteId, targetParameter, n, filter)
    }, viralInterval);


}


analyseTrending = function (siteId, targetParameter, n) {


    pool = RedisPool.getPool();


    db.getLastNFromSeries(n, siteId).then(lastN=> {
        array = db.getMultipleValuesFromJsonArray(db.getArrayFromDatabaseObject(lastN, 'data'), targetParameter, identifierName = 'type', secondNestedParameter = 'dates', thirdNestedParameter = 'items', fourthNestedParameter = ['url', 'value', 'title'], 0);


        let occurrenceObject = {}


        for (let i = 0; i < array.length; i++) {
            if (array[i][0] in occurrenceObject) {
                occurrenceObject[array[i][0]][0]++;
                occurrenceObject[array[i][0]][1] += parseInt(array[i][1])
            }
            else {
                occurrenceObject[array[i][0]] = [1, parseInt(array[i][1]), array[i][2]];

            }
        }
        let sortedOccurrences = _.pairs(occurrenceObject).sort((a, b)=> {
            return b[1][0] - a[1][0]
        })

        for (let i = 0; i < sortedOccurrences.length; i++)
            sortedOccurrences[i][1][1] = sortedOccurrences[i][1][1] / n


        pool.acquire(redisConnection=> {
            redisConnection.zrange('cumulative-statistics-' + targetParameter + ':' + siteId, -1, -1).then(statistics=> {


                let statisticsObject = JSON.parse(statistics)

                filteredOcurrences = sortedOccurrences.filter(a=> {
                    return a[1][1] > statisticsObject['cumulative-average']
                })

                let date = Date.now();


                let trendingObject = JSON.stringify({
                    'siteId': siteId,
                    'timestamp': date,
                    'parameter': targetParameter,
                    'current-average': statisticsObject['cumulative-average'],
                    'current-deviation': statisticsObject['cumulative-standard-deviation'],
                    'trending': _.object(filteredOcurrences)

                });

                pool.acquire(redisConnection=> {
                    return redisConnection.incr('trending-counter-' + targetParameter + ':' + siteId).then((currentCounterValue)=> {
                        redisConnection.zadd('trending-' + targetParameter + ':' + siteId, currentCounterValue, trendingObject);
                    })


                });


            })
        })


    });

}


analyseViral = function (siteId, targetParameter, n, filter) {


    pool.acquire((redisConnection)=> {
            redisConnection.get('trending-counter-' + targetParameter + ':' + siteId).then((counterValue)=> {
                redisConnection.zrange('trending-' + targetParameter + ':' + siteId, counterValue - n, counterValue).then(nTrending=> {


                    let occurrenceObject = {}


                    for (let i = 0; i < nTrending.length; i++) {
                        trendingObject = JSON.parse(nTrending[i]).trending;
                        for (property in trendingObject) {
                            if (trendingObject.hasOwnProperty(property)) {
                                if (occurrenceObject.hasOwnProperty(property))
                                    occurrenceObject[property][0]++
                                else
                                    occurrenceObject[property] = [1, trendingObject[property][2]]
                            }

                        }
                    }

                    let filteredOcurrences = _.pairs(occurrenceObject).filter((b)=> {

                        return b[1][0] > filter;

                    });

                    let date = Date.now();
                    let viralObject = JSON.stringify({
                        'siteId': siteId,
                        'timestamp': date,
                        'parameter': targetParameter,
                        'filter': filter,
                        'viral': _.object(filteredOcurrences)

                    });

                    pool.acquire(redisConnection=> {
                        return redisConnection.incr('viral-counter-' + targetParameter + ':' + siteId).then((currentCounterValue)=> {
                            redisConnection.zadd('viral-' + targetParameter + ':' + siteId, currentCounterValue, viralObject);
                        })

                    })
                })


            })
        }
    )
}








