#!/usr/bin/env node

/* Module dependencies.
*/

'use strict';
let http = require('http');

var config = require('../config/config.json')[process.env.NODE_ENV || 'dev'];
var _this = null;

class WWW {

    constructor() {
        _this = this;
    }

    /**
     * Start
     */
    start(options) {
        // Start the app
        this.app = options.app || require ('./app').start(options);

        // Get port from environment or service list, and store in Express
        this.port = process.env.PORT || options.port || config['services'][options.serviceName]['port'];
        this.app.set('port', this.port);

        this.debug = require('debug')((options.serviceName || 'OutpatientMain') + ":server");

        // Listen on provided port, on all network interfaces.

        this.server = http.createServer(this.app);
        this.server.listen(this.port);
        console.log("Listening on port: " + this.port);

        //Start socket.io chat server
        var io = require('socket.io').listen(this.server);
        io.on('connection', function(socket){
            console.log('a user connected');
            socket.on('disconnect', function(){
                console.log('user disconnected');
            });

            socket.on('chat message', function(msg){
                console.log('message: ' + msg);
                socket.broadcast.emit('chat message', msg);
                //io.emit('chat message', msg);
            });
        });

        //"startChat": "1"

        // Error handler
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

        return this;
    }



    /**
     * Normalize a port into a number, string, or false.
     */

    static normalizePort(val) {
        let port = parseInt(val, 10);

        if (isNaN(port)) {
            // named pipe
            return val;
        }

        if (port >= 0) {
            // port number
            return port;
        }

        return false;
    }


}


module.exports = new WWW();