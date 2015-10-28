'use strict';

var Db = require('mongodb').Db;
var MongoClient = require('mongodb').MongoClient;
var Logger = require('./Logger');

function DbHandler() {
    this.dbPath = 'mongodb://localhost:27017/campfire';

    this.connect = function(callback) {
        var self = this;

        console.log('url:', this.dbPath);
        MongoClient.connect(this.dbPath, function (err, db) {
            if (err) {
                Logger.log('Error: failed to connect to db: ' + self.dbPath, __filename, true, false);
                throw err;
            }

            Logger.log('Connected to database: ' + self.dbPath, __filename, false, false);

            if (callback) {
                callback(err, db);
            }
        });
    };

    this.insert = function(collectionName, insertObjects, callback) {
        Logger.log('Inserting objects: ' + JSON.stringify(insertObjects), __filename, false, false);
        var self = this;
        this.connect(function (err, db) {
            if (err) {
                Logger.log('Error: failed to connect to db: ' + self.dbPath, __filename, true, false);
                throw err;
            }

            Logger.log('Connected to database: ' + self.dbPath, __filename, false, false);

            var collection = db.collection(collectionName);
            collection.insertMany(insertObjects, function(error, result) {
                db.close();
                if (error) {
                    Logger.log(
                        'Error: inserting into collection: ' + collectionName,
                        __filename,
                        true,
                        false
                    );

                    throw error;
                }

                if (callback) {
                    var message = 'Inserted: ' + JSON.stringify(insertObjects) +
                        '\n Into: ' + collectionName + '\n with response: ' + JSON.stringify(result);
                    Logger.log(
                        message,
                        __filename,
                        false,
                        false
                    );

                    callback(result);
                }
            });
        });
    };
}

module.exports = DbHandler;
