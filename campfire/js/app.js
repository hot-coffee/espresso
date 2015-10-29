'use strict';

var express = require('express');
var Logger = require('./logger');
var RequestHandler = require('./request-handler');
var cors = require('cors');
var bodyParser = require('body-parser');
var DbHandler = require('./db-handler');
var jsonFile = require('jsonfile');

function app() {
    this.run = function () {
        if (process.argv.length > 2 && process.argv[2] === 'test') {
            Logger.log('Running tests', __filename, false, false);
        } else if (process.argv.length > 2 && process.argv[2] === 'single') {
            Logger.log('Running get client', __filename, false, false);
            var _id = '562ff7962544df3398d49638';
            var dbHandler = new DbHandler();
            dbHandler.retrieveWithId('clients', _id, function (result) {
                console.log('retrieved client:', result);
            });
        } else if (process.argv.length > 2 && process.argv[2] === 'all') {
            Logger.log('Running get client', __filename, false, false);
            var dbHandler = new DbHandler();
            dbHandler.retrieveAll('clients', function (result) {
                console.log('retrieved clients:', result);
            });
        } else if (process.argv.length > 2 && process.argv[2] === 'populatedb') {
            Logger.log('Populating db with demo data', __filename, false, false);
            var clients = jsonFile.readFileSync('../files/create-clients.json');
            var dbHandler = new DbHandler();
            dbHandler.insert('clients', clients, function (result) {
                console.log('retrieved clients:', result);
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

        var server = expApp.listen(9042, function() {
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
