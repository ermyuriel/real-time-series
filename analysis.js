var db = require('./database_communication');
var R = require("r-script");


module.exports.startAnalysis = function (config) {

    console.log(config.analysis_interval)
    setInterval(() => {
        db.getLastNFromTimeSeries(config.analysis_n, config.series_identifier, config.pool).then(data => analyse(data, config)
        )
    }, config.analysis_interval);


}


analyse = function (data, config) {

    R("script.r").data(data).call(function(err, d) {
        if (err) throw err;
        console.log(d);
    });


}



