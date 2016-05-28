"use strict";

const InvalidUsernameError = function (username, reason) {
    this.name = 'InvalidUsernameError';
    this.message = `Invalid Username "${ username }", reason: "${ reason }"`;
    this.stack = (new Error()).stack;

    this.username = username;
    this.reason = reason;
};
InvalidUsernameError.prototype = Object.create(Error.prototype);
InvalidUsernameError.constructor = InvalidUsernameError;

module.exports = InvalidUsernameError;
