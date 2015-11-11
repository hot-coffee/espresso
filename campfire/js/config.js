'use strict';

var path = require('path');

var appName = 'campfire';

module.exports = {
    appName: 'campfire',
    portNumber: process.env.CAMPFIRE_PORT || '9043',
    recordServerUrl: process.env.RECORD_SERVER_URL || '192.168.1.83',
    logFilePath: path.join(__dirname, '../files', appName + '.json'),

    fetchOptions: {
        fetchAll: '/all-records',
        fetchByIds: '/record-by-ids'
    },

    recordServerUrlWithPort: function () {
        return this.recordServerUrl + ':' + this.recordServerPort;
    }
};