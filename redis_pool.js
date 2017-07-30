/**
 * Created by EUCJ on 10/24/2016.
 */
var pool = require('generic-promise-pool');
var Redis = require('ioredis');
var redisPool = null;


module.exports.startPool = function (config) {

    redisPool = pool.create({

        create: function () {
            connection = new Redis(config.redis_port, config.redis_host);

            if (config.testing == true)
                config.writer.write("redisConnectionCreated\n")


            return connection;

        },
        destroy: function () {
            if (config.testing == true)
                writer.end()
            return connection.disconnect();

        }
    })
    ;


}

module.exports.getPool = function () {

    return redisPool;

}


;


