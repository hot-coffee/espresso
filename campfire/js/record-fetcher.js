'use strict';

var http = require('http');
var Config = require('./config');
var Logger = require('./logger');

function RecordFetcher(database, collection, fetchOption, payload) {
    this.database = database;
    this.collection = collection;
    this.payload = payload;
    this.callback = undefined;

    /*
     * @param callback - args error, responseObject
     */
    this.fetch = function (callback) {
        this.callback = callback;

        var payload = JSON.stringify({
            database: this.database,
            collection: this.collection,
            payload: this.payload
        });

        var options = {
            host: Config.recordServerUrl,
            method: 'POST',
            path: fetchOption,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        };

        console.log('options', options);
        console.log('payload', payload);

        var request = http.request(options, this._responseCallback.bind(this));
        request.end(payload);
    };

    this._finishedFetching = function (error, data) {
        if (error) {
            Logger.log(
                'Failed to fetch with error: ' + JSON.stringify(error),
                __filename,
                true,
                false
            );

            if (this.callback) {
                this.callback(error, null);
            }
            return;
        }

        console.log('finished fetching data:', data);
        Logger.log('Finished fetching data: ' + data, __filename, false, false);

        var decodedData = JSON.parse(data);
        if (this.callback) {
            this.callback(null, decodedData);
        }
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

module.exports = RecordFetcher;
