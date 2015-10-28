'use strict';

var DbHandler = require('./db-handler');
var Logger = require('./Logger');

function RequestHandler() {
    this.dbHandler = new DbHandler();

    this.insertClient = function(req, res) {
        Logger.log('Headers:' + JSON.stringify(req.headers), __filename, false, false);
        Logger.log('Incoming data: '+ req.body, __filename, false, false);
        var data = JSON.parse(req.body);
        var dbHandler = new DbHandler();
        dbHandler.insert('clients', [data], function(result) {
            var message = !!result ? "It's Steven's world!!" :
                "Dude, couldn't insert that object...Bummer";
            res.send(JSON.stringify(message));
        });
    };
}

module.exports = RequestHandler;
