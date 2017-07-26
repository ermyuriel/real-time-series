/**
 * Created by EUCJ on 7/5/2016.
 */

//Module import
var http = require('http');
var RedisPool = require('./redisPool');
var pool=null;


getCurrentData = (type, output, siteId, siteKey)=> {


    //Build object for http request parameters
    let options = {
        host: 'api.clicky.com',
        path: '/api/stats/4?site_id=' + siteId + '&sitekey=' + siteKey + '&type=' + type + '&output=' + output
    };


//On response, build body as data event is emmited. On end event, emit event reply and pass data as callback argument
    http.request(options, (response) => {


        let body = '';
        response.on('data', (data)=>body += data
        );
        response.on('end', ()=> {



            //Build object to be registered. Obtain actual data value and append timestamp as field. Use Date.now for Unix epoch, create object for registration

            let date = Date.now();

            let apiData = JSON.stringify({
                'siteId': siteId, 'timestamp': date, 'data': body
            });

            pool.acquire(function (redisConnection) {


                return redisConnection.incr('series-counter:' + siteId).then((currentCounterValue)=> {
                    redisConnection.zadd('series:' + siteId, currentCounterValue, apiData);
                });
            })


        });
    }).on('error', function (error) {
        console.log(error);

    }).end();
}

///Export to main module
module.exports.startCollection = function (type, output, siteId, siteKey, interval, nodeId = 0) {
    pool = RedisPool.getPool();
    setInterval(()=> {
        getCurrentData(type, output, siteId, siteKey)
    }, interval)


}




