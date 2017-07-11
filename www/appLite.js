'use strict';
let http = require('http');
var config = require('../config/config.json')[process.env.NODE_ENV || 'dev'];
var _this = null;

let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let inflector = require('json-inflector');
let cors = require('cors');
let Promise = require("bluebird");
var winstonLogger = require('../logger/logger');

var app = express();

let routes = require('../routes/routes');

var startOptions = {
    port: '3050',
    serviceName: 'outpatient-main',
    routes: routes
};

process.title = startOptions.serviceName;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

let options =
{
    //request: startOptions.camelize || 'underscore',
    response: 'camelizeLower'
};
app.use(inflector(options));

winstonLogger.setUp(process.title, process.env.PRODUCT = 'outpatient-api');

// Connect all our routes to our application
app.use('/', startOptions.routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found: ' + req.url);
    //winstonLogger.error(err, err.parent, req);
    err.status = 404;
    next(err);
});

// error handlers
app.use(function (err, req, res, next) {
    if (app.get('env') !== 'development') {
        winstonLogger.error(err, err.parent, req);
        // production error handler
        // no stacktraces leaked to login
        res.status(err.status || 500).json();
    }
    else {
        winstonLogger.error(err);
        res.status(err.status || 500).json(err);
    }
});

Promise.onPossiblyUnhandledRejection(function (error) {
    throw error;
});

process.stdin.resume();//so the program will not close instantly

function exitHandler(options, err) {
    if (options.cleanup) winstonLogger.info('clean');
    if (err) winstonLogger.error(err);
    if (options.exit) {
        winstonLogger.info('Exiting the app');
        setTimeout(function () {
            process.exit();
        }, 3000);

    }
}

process.on('exit', function () {
    process.emit('cleanup');
});

// catch ctrl+c event and exit normally
process.on('SIGINT', function () {
    winstonLogger.info('Ctrl-C... forced exit');
    setTimeout(function () {
        process.exit(2);
    }, 3000);
});

//catch uncaught exceptions, trace, then exit normally
process.on('uncaughtException', function (e) {
    winstonLogger.error('Uncaught Exception', e);
    // setTimeout(function () {
    //     process.exit(99);
    // }, 3000);
});

const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, p) => {
    winstonLogger.error(p);
    winstonLogger.error(reason);
    unhandledRejections.set(p, reason);
});

process.on('rejectionHandled', (p) => {
    unhandledRejections.delete(p);
});

//www
this.port = process.env.PORT || startOptions.port || config['services'][startOptions.serviceName]['port'];
app.set('port', this.port);

this.debug = require('debug')((startOptions.serviceName || 'OutpatientMain') + ":server");

// Listen on provided port, on all network interfaces.

this.server = http.createServer(app);
var _this = this;
this.server.listen(this.port);
console.log("Listening on port: " + this.port);

this.server.on('error', function(error) {

    if (error.syscall !== 'listen') {
        throw error;
    }

    let bind = typeof _this.port === 'string'
        ? 'Pipe ' + _this.port
        : 'Port ' + _this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

// Listening handler
this.server.on('listening', function() {
    let addr = _this.server.address();
    let bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    _this.debug('Listening on ' + bind);
});

module.exports = app.listen();