var collection = require('./collection');
var analysis = require('./analysis');
var config = require('./configuration')


if (config.testing == true) {


    config.writer.write("appStart" + config.start + "\n")
}

process.on('exit', function () {

    if (config.testing == true)
        config.writer.write("ExecutionTime:" + (Date.now() - config.start) + "\nN" + config.analysis_n)


})

setTimeout(() => process.exit(), config.duration);

collection.startCollection(config);

analysis.startAnalysis(config);



