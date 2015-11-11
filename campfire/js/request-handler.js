'use strict';

var RecordFetcher = require('./record-fetcher');
var Logger = require('./logger');
var Config = require('./config');
var RequestResponse = require('./request-response');

function RequestHandler() {
    this.insertClient = function(req, res) {
        Logger.log('Headers:' + JSON.stringify(req.headers), __filename, false, false);
        Logger.log('Incoming data: '+ JSON.stringify(req.body), __filename, false, false);
        var data = req.body;


        //TODO - Make Endpoint to handle insertion of data on data server
    };

    this.getAllClients = function (req, res) {
        var recordFetcher = new RecordFetcher(
            'camplight',
            'clients',
            Config.fetchOptions.fetchAll,
            null
        );

        recordFetcher.fetch(function (error, responseObject) {
            var requestResponse = new RequestResponse(error, responseObject, res);
            requestResponse.respond();
        });

    };

    this.getClient = function (req, res) {
        //TODO - Add error handling if req.params.cleintId does not exist
        var id = req.params.clientId;
        var recordFetcher = new RecordFetcher(
            'camplight',
            'clients',
            Config.fetchOptions.fetchByIds,
            [id]
        );

        recordFetcher.fetch(function (error, responseObject) {
            var requestResponse = new RequestResponse(error, responseObject, res);
            requestResponse.respond();
        });
    };
}

module.exports = RequestHandler;
