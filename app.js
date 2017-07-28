var recoleccion = require('./collection');
var analysis = require('./analysis');
var config = require('./configuration')


recoleccion.startCollection(config);

analysis.startAnalysis(config);



