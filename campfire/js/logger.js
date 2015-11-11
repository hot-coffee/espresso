'use strict';

var colors = require('colors');
var fs = require('fs');
var Config = require('./config');

module.exports = {
    log: function (message, fileName, isError, skipLine) {
        var logMessage = new Date().toString() + ' ';

        if (fileName) {
            var fileParts = fileName.split('/');
            logMessage += fileParts.pop() + ' :: ';
        }

        if (isError) {
            logMessage += 'ERROR: ';
        }

        logMessage += message;

        if (skipLine) {
            logMessage += '\n';
        }

        fs.appendFile(Config.logFilePath, logMessage + '\n', function (error) {
            if (error) {
                var errorMessage = 'ERROR WRITING TO LOG FILE: ' + Config.logFilePath;
                console.log(errorMessage.red);
            }

            if (isError) {
                console.log(logMessage.red);
            } else {
                console.log(logMessage.yellow);
            }
        });
    }
};