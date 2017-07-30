var db = require('./database_communication');
var R = require("r-script");


module.exports.startAnalysis = function (config) {


    setInterval(() => {
        db.getLastNFromTimeSeries(config).then(data => analyse(data, config)
        )
    }, config.analysis_interval);


}


analyse = function (data, config) {



    R("script.r").data(data).call(function (err, result) {
        if (err) throw err;

        if (config.testing == true)
            config.writer.write("succesfulAnalysis\n")


        db.writeToTimeSeries(result, config, 1);


    });


}



