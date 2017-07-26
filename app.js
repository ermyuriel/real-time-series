var apiLogging = require('./apiLogging');
var statisticsLogging = require('./statisticsLogging');
var redisPool = require('./redisPool');
var analysis = require('./analysis');
var config = require('./config.json');


redisPool.startPool(config.redisServer);
apiLogging.startCollection(config.type, config.output, config.siteId, config.siteKey, config.apiInterval);

statisticsLogging.startLoggingCumulativeStatistics(config.siteId, config.targetParameter, config.averageN, config.cumulativeAverageN, config.averageInterval, config.cumulativeAverageInterval);


analysis.startAnalysis(config.siteId, config.targetParameter, config.analysisN, config.trendingInterval, config.viralInterval, config.trendingFilter);



