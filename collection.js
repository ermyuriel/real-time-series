var http = require('http');
var db = require('./database_communication')


module.exports.startCollection = function (config) {

    let series = config.series_identifier
    let pool = config.pool
    let provider = config.api_provider
    let options = config.api_options
    let interval = config.api_interval

    setInterval(() => {
        http.request(options, (response) => {

            let body = '';

            response.on('data', (data) => body += data);

            response.on('end', () => {
                db.writeToTimeSeries(series, body, pool, provider);
            });

        }).on('error', function (error) {
            console.log(error);

        }).end()
    }, interval)


}




