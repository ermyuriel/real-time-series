var http = require('http');
var db = require('./database_communication')


module.exports.startCollection = function (config) {

    setInterval(() => {
        http.request(config.api_options, (response) => {

            if (config.testing == true)
                config.writer.write("apiRequestAttempted\n")


            let body = '';

            response.on('data', (data) => body += data);

            response.on('end', () => {

                if (config.testing == true)
                    config.writer.write("apiRequestSuccess\n")


                db.writeToTimeSeries(body, config);
            });

        }).on('error', function (error) {
            console.log(error);
            if (config.testing == true)
                config.writer.write("apiRequestFailed\n")


        }).end()
    }, config.api_interval)


}




