'use strict';

var DbHandler = require('./db-handler');
var Logger = require('./logger');

function RequestHandler() {
    this.insertClient = function(req, res) {
        Logger.log('Headers:' + JSON.stringify(req.headers), __filename, false, false);
        Logger.log('Incoming data: '+ req.body, __filename, false, false);
        var data = req.body;
        var dbHandler = new DbHandler();
        dbHandler.insert(this.collections.clients, [data], function(result) {
            var message = !!result ? "It's Steven's world!!" :
                "Dude, couldn't insert that object...Bummer";
            res.send(JSON.stringify(message));
        });
    };

    this.getAllClients = function (req, res) {
        var dbHandler = new DbHandler();
        dbHandler.retrieveAll('clients', function (result) {
            res.send(JSON.stringify(result));
        });
    };

    this.getClient = function (req, res) {
        var dbHandler = new DbHandler();
        var id = req.params.clientId;
        dbHandler.retrieveWithId('clients', id, function (result) {
            res.send(JSON.stringify(result));
        });
    };
}

module.exports = RequestHandler;
