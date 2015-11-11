'use strict';

var http = require('http');
var Config = require('./config');
var Logger = require('./logger');

function RecordSaver(database, collection, fetchOption, payload) {
    this.database = database;
    this.collection = collection;
    this.payload = payload;

    /*
     * @param callback - args error, responseObject
     */
    this.save = function (callback) {
        var options = {
            host: Config.recordServerUrl,
            port: Config.recordServerPort,
            method: 'POST',
            path: Config.fetchOptions[fetchOption]
        };

        var payload = {
            database: this.database,
            collection: this.collection,
            payload: this.payload
        };

        var request = http.request(options, this._responseCallback);
        request.write(JSON.stringify(payload));
        request.end();
    };

    this._finishedFetching = function (error, data, callback) {
        if (error) {
            Logger.log(
                'Failed to fetch with error: ' + JSON.stringify(error),
                __filename,
                true,
                false
            );
            callback(error, null);
            return;
        }

        var decodedData = JSON.parse(data);
        callback(null, decodedData);
    };

    this._responseCallback = function (response) {
        var responseStr = '';

        response.on('data', function (chunk) {
            responseStr += chunk;
        });

        response.on('error', function (error) {
            this._finishedFetching(error, null);
        }.bind(this));

        response.on('end', function () {
             this._finishedFetching(null, responseStr);
        }.bind(this));
    };
}

module.exports = RecordSaver;
