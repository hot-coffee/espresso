'use strict';

function Client(clientObject) {
    this.firstName = clientObject.firstName;
    this.lastName = clientObject.lastName;
    this.email = clientObject.email;
    this.experience = clientObject.experience;
    this.age = clientObject.age;
}

module.exports = Client;