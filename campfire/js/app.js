'use strict';

var express = require('express');
var Logger = require('./logger');
var RequestHandler = require('./request-handler');
var cors = require('cors');
var bodyParser = require('body-parser');
var RecordFetcher = require('./record-fetcher');
var RecordSaver = require('./record-saver');
var jsonFile = require('jsonfile');
var Config = require('./config');

function app() {
    this.run = function () {
        if (process.argv.length > 2 && process.argv[2] === 'test') {
            Logger.log('Running tests', __filename, false, false);
        } else if (process.argv.length > 2 && process.argv[2] === 'single') {
            Logger.log('Running get client', __filename, false, false);
            var _id = '562ff7962544df3398d49638';
            var recordFetcher = new RecordFetcher(
                'camplight',
                'clients',
                Config.fetchOptions.fetchByIds,
                [_id]
            );

            recordFetcher.fetch(function (error, result) {
                if (error) {
                    Logger.log('Fetching client with id: ' +  _id, __filename, true, false);
                    return;
                }

                Logger.log('Successfully fetched client with id: ' + _id, __filename, false, false);
            });
        } else if (process.argv.length > 2 && process.argv[2] === 'all') {
            Logger.log('Running get clients', __filename, false, false);

            var recordFetcher = new RecordFetcher(
                'camplight',
                'clients',
                Config.fetchOptions.fetchAll,
                null
            );

            recordFetcher.fetch(function (error, result) {
                if (error) {
                    Logger.log('Fetching all clients: ', __filename, true, false);
                    return;
                }

                Logger.log(
                    'Successfully fetched all clients: ' + JSON.stringify(result),
                    __filename,
                    false,
                    false
                );
            });
        } else {
            this.startServer();
        }
    };

    this.startServer = function() {
        var requestHandler = new RequestHandler();
        var expApp = this.configuredApp();

        // handle posts
        expApp.post('/save-client', requestHandler.insertClient);

        // handle gets
        expApp.get('/all-clients', requestHandler.getAllClients);
        expApp.get('/get-client', requestHandler.getClient);

        var server = expApp.listen(Config.portNumber, function() {
            var host = server.address().address;
            var port = server.address().port;

            Logger.log('running server at: ' + host + ':' + port, __filename, false, false);
        });
    };

    this.configuredApp = function() {
        var expApp = express();
        expApp.use(cors());
        expApp.use(bodyParser.json());

        return expApp;
    };
}

module.exports = app;
