/**
 * Created by EUCJ on 10/24/2016.
 */
var pool = require('generic-promise-pool');
var Redis = require('ioredis');
var redisPool = null;

module.exports.startPool = function (port, host) {

    redisPool = pool.create({

        create: function () {
            connection = new Redis(port, host);
            return connection;

        },
        destroy: function () {

            return connection.disconnect();

        }
    })
    ;


}

module.exports.getPool = function () {

    return redisPool;

}


;


