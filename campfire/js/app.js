'use strict';

var express = require('express');
var Logger = require('./Logger');
var RequestHandler = require('./request-handler');
var cors = require('cors');

function app() {
    this.run = function () {
        if (process.argv.length > 2 && process.argv[2] === 'test') {
            Logger.log('Running tests', __filename, false, false);
        } else {
            this.startServer();
        }
    };

    this.startServer = function() {
        var expApp = this.createApp();
        var requestHandler = new RequestHandler();

        // posts
        expApp.post('/save-client', requestHandler.insertClient);

        var server = expApp.listen(9042, function() {
            var host = server.address().address;
            var port = server.address().port;

            Logger.log('running server at: ' + host + ':' + port, __filename, false, false);
        });
    };

    this.allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', '*,Origin,X-Requested-With,Content-Type,Accept');
        res.header('Access-Control-Max-Age', 86400);
        next();
    };

    this.createApp = function() {
        var expApp = express();
        expApp.use(cors());

        return expApp;
    };
}

module.exports = app;
