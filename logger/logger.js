var winston = require('winston');
//var MongoDB = require('winston-mongodb').MongoDB;
var fs = require('fs');
const config = require('../config/config.json')[process.env.NODE_ENV || 'dev'];
var service = '';
var product = '';

function customInfoFormatter (options) {
    return new Date().toISOString() + ' [' + options.level.toUpperCase() + '] '
        + (options.meta && options.meta.status ? options.meta.status : '') + ' '
        + (options.message ? options.message:(options.meta && options.meta.message ? options.meta.message:''))
}

function customErrorFormatter (options) {
    return new Date().toISOString() + ' [' + options.level.toUpperCase() + '] '
        + (options.meta && options.meta.status ? options.meta.status : '') + ' '
        + (options.message ? options.message:(options.meta && options.meta.message ? options.meta.message:'')) + ' '
        + (options.meta && options.meta.stack) ? options.meta.stack : ''
}

function customMongoFormatter (options) {
    var customErr = {
        Service: service,
        Product: product,
        Timestamp: new Date().toISOString(),
        Level: options.level.toUpperCase(),
        Status: options.meta.status,
        Message: (options.message ? options.message : options.meta.message),
        Stack: options.meta.stack
    };

    return JSON.stringify(customErr);
}

var logger = new winston.Logger({
    transports: [
        new (winston.transports.Console)({
            colorize: 'all',
            prettyPrint: true
        })
    ],
    exitOnError: false
});

logger.setUp = function(serviceName, productName, mongoCollection = 'logs', logPath = config.logDir) {
    //create log Path if it does not exist
    if (!fs.existsSync(logPath)) {
		console.log(logPath);
        fs.mkdirSync(logPath);
    }
    
    service = serviceName.toLocaleUpperCase();
    product = productName.toLocaleUpperCase();

    logger.add (winston.transports.File, {
        name: 'error-file',
        level: 'error',
        filename: logPath + '/' + service + '_' + product + '_' + 'exceptions.log',
        json: false,
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: false,
        formatter: customErrorFormatter
    });

    logger.add (winston.transports.File, {
        name: 'info-file',
        level: 'info',
        filename: logPath + '/' + service + '_' + product + '_' + 'info.log',
        json: false,
        maxsize: 5242880, //5MB
        maxFiles: 5,
        colorize: true,
        formatter: customInfoFormatter
    });

   /* logger.add (winston.transports.MongoDB, {
        level: 'error',
        db : config.mongoConnection,
        collection: mongoCollection,
        formatter: customMongoFormatter
    });*/
};


module.exports = logger;