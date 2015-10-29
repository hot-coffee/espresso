'use strict';

var MongoClient = require('mongodb').MongoClient;
var Logger = require('./logger');
var ObjectID = require('mongodb').ObjectID;

function DbHandler() {
    this.dbPath = 'mongodb://localhost:27017/campfire';

    this._connect = function(callback) {
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
        this._connect(function (err, db) {
            this._handleConnectionError(err);

            Logger.log('Connected to database: ' + this.dbPath, __filename, false, false);

            var collection = db.collection(collectionName);
            collection.insertMany(insertObjects, function (error, result) {
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
        }.bind(this));
    };

    this.retrieveAll = function (collectionName, callback) {
        Logger.log('Retrieving objects for: ' + collectionName, __filename, false, false);
        this._connect(function (err, db) {
            this._handleConnectionError(err);

            Logger.log('Connected to database: ' + this.dbPath, __filename, false, false);

            var collection = db.collection(collectionName);
            collection.find().toArray(function(error, result) {
                db.close();
                if (error) {
                    Logger.log(
                        'Error: retrieving all objects from: ' + collectionName,
                        __filename,
                        true,
                        false
                    );

                    throw error;
                }

                if (callback) {
                    callback(result);
                }
            });
        }.bind(this));
    };

    this.retrieveWithId = function (collectionName, id, callback) {
        Logger.log('Retrieving objects for: ' + collectionName, __filename, false, false);
        this._connect(function (err, db) {
            this._handleConnectionError(err);

            Logger.log('Connected to database: ' + this.dbPath, __filename, false, false);

            var objectId = new ObjectID(id);
            var collection = db.collection(collectionName);
            collection.find({_id:objectId}).toArray(function(error, result) {
                db.close();
                if (error) {
                    Logger.log(
                        'Error: retrieving all objects from: ' + collectionName,
                        __filename,
                        true,
                        false
                    );

                    throw error;
                }

                if (callback) {
                    callback(result);
                }
            });
        }.bind(this));
    };

    this._handleConnectionError = function(err) {
        if (err) {
            Logger.log('Error: failed to connect to db: ' + this.dbPath, __filename, true, false);
            throw err;
        }
    };
}

module.exports = DbHandler;
