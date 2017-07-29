/**
 * Created by ermyuriel on 7/26/2017.
 */

var config = require('./configuration_parameters.json');
var redisPool = require('./redis_pool');
var api_parameters = require('./api_parameters.json')[config.api_provider];
var build_url = require('build-url');


config.api_options = {

    host: api_parameters.host,
    path: build_url(api_parameters.prefix, api_parameters)

}

config.analysis_series_identifier = api_parameters.time_series_identifier + "_" + config.analysis_provider + "_" + config.analysis_method;

config.time_series_identifier = api_parameters.series_identifier;

redisPool.startPool(config.redisPort, config.redisServer);

config.pool = redisPool.getPool();

module.exports = config;