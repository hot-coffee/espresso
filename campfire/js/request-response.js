'use strict';

function RequestResponse(error, result, response) {
    this.error = error;
    this.result = result;
    this.response = response;

    this.respond = function() {
        var responseObject = {
            error: this.error,
            result: this.result
        };

        this.response.send(JSON.stringify(responseObject));
    }
}

module.exports = RequestResponse;
