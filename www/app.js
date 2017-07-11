/**
 * Common class for app, so that individual services can simply invoke as follows:
 * Usage: require('beepicommon').app.start()
 */

/* Dependencies */
let express = require('express');
let path = require('path');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let inflector = require('json-inflector');
let cors = require('cors');
let Promise = require("bluebird");
var winstonLogger = require('../logger/logger');

class App {

    constructor() {
        this.app = null;
    }
    
    start(startOptions) {
        //console.log("Hello world!");
        const app = express();
        this.app = app;

        process.title = startOptions.serviceName;
        
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(cookieParser());
        //console.log(path.resolve(__dirname, '../views'));
        //app.use(express.static(path.join(__dirname, 'views')));
        app.use(express.static(path.resolve(__dirname, '../views/sendbird')));
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
            console.log("app.js: " + JSON.stringify(err, null, 4));
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

        return app;
    }
}

module.exports = new App();